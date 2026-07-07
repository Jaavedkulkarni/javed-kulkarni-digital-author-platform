import { ConflictError, InternalError } from '../_shared/errors/app-error.ts';
import { createEnterpriseHandler, emitDomainEventAndAudit } from '../_shared/handler-enterprise.ts';
import { assertProfileExists } from '../_shared/permissions/checks.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import { validateUserIdRequest } from '../_shared/validation/user-requests.ts';

Deno.serve(
  createEnterpriseHandler('restore-user', { permission: 'super_admin' }, async (ctx) => {
    const payload = validateUserIdRequest(ctx.body);
    const profile = await assertProfileExists(ctx.adminClient, payload.userId);

    if (!profile.deleted_at && profile.status === 'active') {
      throw new ConflictError('User is already active');
    }

    const { data, error } = await ctx.adminClient
      .from('profiles')
      .update({
        deleted_at: null,
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', payload.userId)
      .select('id, status, deleted_at')
      .single();

    if (error || !data) throw new InternalError(error?.message ?? 'Failed to restore user');

    await emitDomainEventAndAudit(ctx, {
      eventType: 'UserRestored',
      payload: { userId: payload.userId, reason: payload.reason },
      audit: {
        action: 'restore',
        entity: 'user',
        targetId: payload.userId,
        targetType: 'user',
        beforeState: profile as Record<string, unknown>,
        afterState: data as Record<string, unknown>,
      },
      activity: {
        targetId: payload.userId,
        targetType: 'user',
        activityType: 'restore',
        description: 'User restored',
      },
    });

    return jsonSuccess({ userId: data.id, status: data.status, deletedAt: data.deleted_at });
  }),
);
