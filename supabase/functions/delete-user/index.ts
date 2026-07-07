import { ConflictError, InternalError } from '../_shared/errors/app-error.ts';
import { createEnterpriseHandler, emitDomainEventAndAudit } from '../_shared/handler-enterprise.ts';
import { assertProfileExists } from '../_shared/permissions/checks.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import { validateUserIdRequest } from '../_shared/validation/user-requests.ts';

Deno.serve(
  createEnterpriseHandler('delete-user', { permission: 'super_admin' }, async (ctx) => {
    const payload = validateUserIdRequest(ctx.body);
    const profile = await assertProfileExists(ctx.adminClient, payload.userId);

    if (profile.deleted_at) throw new ConflictError('User is already deleted');

    const deletedAt = new Date().toISOString();
    const { data, error } = await ctx.adminClient
      .from('profiles')
      .update({ deleted_at: deletedAt, updated_at: deletedAt })
      .eq('id', payload.userId)
      .select('id, deleted_at')
      .single();

    if (error || !data) throw new InternalError(error?.message ?? 'Failed to delete user');

    await emitDomainEventAndAudit(ctx, {
      eventType: 'UserDeleted',
      payload: { userId: payload.userId, reason: payload.reason },
      audit: {
        action: 'delete',
        entity: 'user',
        targetId: payload.userId,
        targetType: 'user',
        beforeState: profile as Record<string, unknown>,
        afterState: data as Record<string, unknown>,
      },
      activity: {
        targetId: payload.userId,
        targetType: 'user',
        activityType: 'delete',
        description: 'User soft-deleted',
      },
    });

    return jsonSuccess({ userId: data.id, deletedAt: data.deleted_at });
  }),
);
