import { ConflictError, InternalError } from '../_shared/errors/app-error.ts';
import { createEnterpriseHandler, emitDomainEventAndAudit } from '../_shared/handler-enterprise.ts';
import { assertProfileExists } from '../_shared/permissions/checks.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import { validateUserIdRequest } from '../_shared/validation/user-requests.ts';

Deno.serve(
  createEnterpriseHandler('suspend-user', { permission: 'super_admin' }, async (ctx) => {
    const payload = validateUserIdRequest(ctx.body);
    const profile = await assertProfileExists(ctx.adminClient, payload.userId);

    if (profile.status === 'suspended') throw new ConflictError('User is already suspended');

    const { data, error } = await ctx.adminClient
      .from('profiles')
      .update({ status: 'suspended', updated_at: new Date().toISOString() })
      .eq('id', payload.userId)
      .select('id, status')
      .single();

    if (error || !data) throw new InternalError(error?.message ?? 'Failed to suspend user');

    await emitDomainEventAndAudit(ctx, {
      eventType: 'UserSuspended',
      payload: { userId: payload.userId, reason: payload.reason },
      audit: {
        action: 'suspend',
        entity: 'user',
        targetId: payload.userId,
        targetType: 'user',
        beforeState: profile as Record<string, unknown>,
        afterState: data as Record<string, unknown>,
      },
      activity: {
        targetId: payload.userId,
        targetType: 'user',
        activityType: 'suspend',
        description: 'User suspended',
      },
    });

    return jsonSuccess({ userId: data.id, status: data.status });
  }),
);
