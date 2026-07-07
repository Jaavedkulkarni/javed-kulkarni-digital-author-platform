import { ForbiddenError, InternalError, ValidationError } from '../_shared/errors/app-error.ts';
import {
  createEnterpriseHandler,
  emitDomainEventAndAudit,
} from '../_shared/handler-enterprise.ts';
import { loadFeatureFlags, requireFeatureFlag } from '../_shared/feature-flags/index.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import { sanitizeRecord } from '../_shared/security/headers.ts';
import {
  AVATAR_BUCKET,
  buildAvatarPath,
  buildAvatarPublicUrl,
  extensionFromMime,
  validateAvatarMime,
  validateAvatarSize,
} from '../_shared/storage/avatar.ts';
import { enqueueJob } from '../_shared/jobs/queue.ts';

interface UploadAvatarRequest {
  userId?: string;
  mimeType: string;
  dataBase64: string;
}

function parseUploadRequest(body: unknown): UploadAvatarRequest {
  if (!body || typeof body !== 'object') throw new ValidationError('Request body is required');
  const input = sanitizeRecord(body as Record<string, unknown>);

  if (typeof input.mimeType !== 'string') throw new ValidationError('mimeType is required');
  if (typeof input.dataBase64 !== 'string' || !input.dataBase64.trim()) {
    throw new ValidationError('dataBase64 is required');
  }

  validateAvatarMime(input.mimeType);

  return {
    userId: typeof input.userId === 'string' ? input.userId : undefined,
    mimeType: input.mimeType,
    dataBase64: input.dataBase64.replace(/^data:[^;]+;base64,/, ''),
  };
}

function decodeBase64(dataBase64: string): Uint8Array {
  const binary = atob(dataBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

Deno.serve(
  createEnterpriseHandler('upload-avatar', { permission: 'staff' }, async (ctx) => {
    const payload = parseUploadRequest(ctx.body);
    const flags = await loadFeatureFlags(ctx.adminClient);
    requireFeatureFlag(flags, 'EnableAvatarUpload');

    const targetUserId = payload.userId ?? ctx.actor.id;
    const isSelf = targetUserId === ctx.actor.id;
    const isSuperAdmin = ctx.actorRoles.includes('super_admin');

    if (!isSelf && !isSuperAdmin) {
      throw new ForbiddenError('Cannot upload avatar for another user');
    }

    const bytes = decodeBase64(payload.dataBase64);
    validateAvatarSize(bytes.length);

    const { data: profile, error: profileError } = await ctx.adminClient
      .from('profiles')
      .select('avatar_version, avatar_storage_path')
      .eq('id', targetUserId)
      .single();

    if (profileError || !profile) {
      throw new InternalError('Profile not found');
    }

    const nextVersion = (profile.avatar_version ?? 0) + 1;
    const extension = extensionFromMime(payload.mimeType);
    const storagePath = buildAvatarPath(targetUserId, nextVersion, extension);

    if (profile.avatar_storage_path) {
      await ctx.adminClient.storage.from(AVATAR_BUCKET).remove([profile.avatar_storage_path]);
    }

    const { error: uploadError } = await ctx.adminClient.storage
      .from(AVATAR_BUCKET)
      .upload(storagePath, bytes, {
        contentType: payload.mimeType,
        upsert: true,
        cacheControl: '3600',
      });

    if (uploadError) {
      throw new InternalError(uploadError.message);
    }

    const updatedAt = new Date().toISOString();
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const publicUrl = buildAvatarPublicUrl(supabaseUrl, storagePath);

    const { error: updateError } = await ctx.adminClient
      .from('profiles')
      .update({
        avatar: publicUrl,
        avatar_storage_path: storagePath,
        avatar_version: nextVersion,
        avatar_updated_at: updatedAt,
        updated_at: updatedAt,
      })
      .eq('id', targetUserId);

    if (updateError) {
      throw new InternalError(updateError.message);
    }

    await enqueueJob(ctx.adminClient, {
      jobType: 'thumbnail_generation',
      payload: { userId: targetUserId, storagePath, version: nextVersion },
    }, ctx.logger);

    const response = {
      userId: targetUserId,
      storagePath,
      publicUrl,
      version: nextVersion,
      updatedAt,
    };

    await emitDomainEventAndAudit(ctx, {
      eventType: 'AvatarUploaded',
      payload: response,
      audit: {
        action: 'update',
        entity: 'avatar',
        targetId: targetUserId,
        targetType: 'user',
        beforeState: { path: profile.avatar_storage_path, version: profile.avatar_version },
        afterState: response as unknown as Record<string, unknown>,
      },
      activity: {
        targetId: targetUserId,
        targetType: 'user',
        activityType: 'avatar_change',
        description: 'Avatar uploaded',
        metadata: { version: nextVersion },
      },
    });

    return jsonSuccess(response);
  }),
);
