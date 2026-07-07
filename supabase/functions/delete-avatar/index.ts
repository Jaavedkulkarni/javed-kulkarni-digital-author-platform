import { ForbiddenError, InternalError, ValidationError } from '../_shared/errors/app-error.ts';
import {
  createEnterpriseHandler,
  emitDomainEventAndAudit,
} from '../_shared/handler-enterprise.ts';
import { loadFeatureFlags, requireFeatureFlag } from '../_shared/feature-flags/index.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import { AVATAR_BUCKET } from '../_shared/storage/avatar.ts';

interface DeleteAvatarRequest {
  userId?: string;
}

function parseDeleteRequest(body: unknown): DeleteAvatarRequest {
  if (!body || typeof body !== 'object') return {};
  const input = body as Record<string, unknown>;
  return { userId: typeof input.userId === 'string' ? input.userId : undefined };
}

Deno.serve(
  createEnterpriseHandler('delete-avatar', { permission: 'staff' }, async (ctx) => {
    const payload = parseDeleteRequest(ctx.body);
    const flags = await loadFeatureFlags(ctx.adminClient);
    requireFeatureFlag(flags, 'EnableAvatarUpload');

    const targetUserId = payload.userId ?? ctx.actor.id;
    const isSelf = targetUserId === ctx.actor.id;
    const isSuperAdmin = ctx.actorRoles.includes('super_admin');

    if (!isSelf && !isSuperAdmin) {
      throw new ForbiddenError('Cannot delete avatar for another user');
    }

    const { data: profile, error: profileError } = await ctx.adminClient
      .from('profiles')
      .select('avatar_storage_path, avatar_version, avatar')
      .eq('id', targetUserId)
      .single();

    if (profileError || !profile) {
      throw new ValidationError('Profile not found');
    }

    if (!profile.avatar_storage_path) {
      return jsonSuccess({ userId: targetUserId, deleted: false });
    }

    const { error: removeError } = await ctx.adminClient.storage
      .from(AVATAR_BUCKET)
      .remove([profile.avatar_storage_path]);

    if (removeError) {
      throw new InternalError(removeError.message);
    }

    const updatedAt = new Date().toISOString();
    const { error: updateError } = await ctx.adminClient
      .from('profiles')
      .update({
        avatar: null,
        avatar_storage_path: null,
        avatar_updated_at: updatedAt,
        updated_at: updatedAt,
      })
      .eq('id', targetUserId);

    if (updateError) {
      throw new InternalError(updateError.message);
    }

    const response = { userId: targetUserId, deleted: true, previousPath: profile.avatar_storage_path };

    await emitDomainEventAndAudit(ctx, {
      eventType: 'AvatarDeleted',
      payload: response,
      audit: {
        action: 'delete',
        entity: 'avatar',
        targetId: targetUserId,
        targetType: 'user',
        beforeState: {
          path: profile.avatar_storage_path,
          url: profile.avatar,
          version: profile.avatar_version,
        },
        afterState: { deleted: true },
      },
      activity: {
        targetId: targetUserId,
        targetType: 'user',
        activityType: 'avatar_change',
        description: 'Avatar deleted',
      },
    });

    return jsonSuccess(response);
  }),
);
