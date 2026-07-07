import { InternalError } from '../_shared/errors/app-error.ts';
import { createEnterpriseHandler, emitDomainEventAndAudit } from '../_shared/handler-enterprise.ts';
import { assertProfileExists } from '../_shared/permissions/checks.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import { buildFullName, validateUpdateUserRequest } from '../_shared/validation/user-requests.ts';

function splitFullName(fullName: string | null): { firstName: string; lastName: string } {
  const normalized = (fullName ?? '').trim();
  if (!normalized) return { firstName: '', lastName: '' };
  const parts = normalized.split(/\s+/);
  return { firstName: parts[0] ?? '', lastName: parts.slice(1).join(' ') };
}

Deno.serve(
  createEnterpriseHandler('update-user', { permission: 'super_admin' }, async (ctx) => {
    const payload = validateUpdateUserRequest(ctx.body);
    const before = await assertProfileExists(ctx.adminClient, payload.userId);

    const { data: currentProfile, error: readError } = await ctx.adminClient
      .from('profiles')
      .select('full_name, email, status, phone, preferred_language, timezone')
      .eq('id', payload.userId)
      .single();

    if (readError || !currentProfile) {
      throw new InternalError(readError?.message ?? 'Failed to load profile');
    }

    const currentName = splitFullName(currentProfile.full_name);
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (payload.firstName !== undefined || payload.lastName !== undefined || payload.displayName !== undefined) {
      update.full_name = buildFullName(
        payload.firstName ?? currentName.firstName,
        payload.lastName ?? currentName.lastName,
        payload.displayName,
      );
    }
    if (payload.phone !== undefined) update.phone = payload.phone;
    if (payload.status !== undefined) update.status = payload.status;
    if (payload.language !== undefined) update.preferred_language = payload.language;
    if (payload.timezone !== undefined) update.timezone = payload.timezone;

    const { data, error } = await ctx.adminClient
      .from('profiles')
      .update(update)
      .eq('id', payload.userId)
      .select('id, email, full_name, status, phone, preferred_language, timezone')
      .single();

    if (error || !data) throw new InternalError(error?.message ?? 'Failed to update profile');

    await emitDomainEventAndAudit(ctx, {
      eventType: 'UserUpdated',
      payload: { userId: payload.userId },
      audit: {
        action: 'update',
        entity: 'user',
        targetId: payload.userId,
        targetType: 'user',
        beforeState: currentProfile as Record<string, unknown>,
        afterState: data as Record<string, unknown>,
      },
      activity: {
        targetId: payload.userId,
        targetType: 'user',
        activityType: 'update',
        description: 'User profile updated',
      },
    });

    return jsonSuccess({ profile: data, previousStatus: before.status });
  }),
);
