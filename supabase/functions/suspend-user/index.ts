import { InternalError } from '../_shared/errors/app-error.ts';
import { createEnterpriseHandler, emitDomainEventAndAudit } from '../_shared/handler-enterprise.ts';
import { enqueueJob } from '../_shared/jobs/queue.ts';
import {
  assertCanSuspendUser,
  assertProfileSuspendable,
} from '../_shared/permissions/user-lifecycle.ts';
import { assertProfileExists } from '../_shared/permissions/checks.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import { writeSuspensionMetadata } from '../_shared/user-lifecycle/metadata.ts';
import { validateSuspendUserRequest } from '../_shared/validation/user-requests.ts';

Deno.serve(
  createEnterpriseHandler('suspend-user', { permission: 'super_admin' }, async (ctx) => {
    const payload = validateSuspendUserRequest(ctx.body);
    const profile = await assertProfileExists(ctx.adminClient, payload.userId);

    await assertProfileSuspendable(profile);
    await assertCanSuspendUser(ctx.adminClient, ctx.actor.id, payload.userId);

    const { data, error } = await ctx.adminClient
      .from('profiles')
      .update({ status: 'suspended', updated_at: new Date().toISOString() })
      .eq('id', payload.userId)
      .select('id, status')
      .single();

    if (error || !data) throw new InternalError(error?.message ?? 'Failed to suspend user');

    await writeSuspensionMetadata(ctx.adminClient, payload.userId, ctx.actor.id, {
      reason: payload.reason,
      notes: payload.notes,
      effectiveImmediately: payload.effectiveImmediately,
    });

    await emitDomainEventAndAudit(ctx, {
      eventType: 'UserSuspended',
      payload: {
        userId: payload.userId,
        reason: payload.reason,
        notes: payload.notes,
        effectiveImmediately: payload.effectiveImmediately,
      },
      audit: {
        action: 'suspend',
        entity: 'user',
        targetId: payload.userId,
        targetType: 'user',
        beforeState: profile as Record<string, unknown>,
        afterState: data as Record<string, unknown>,
        metadata: { reason: payload.reason, notes: payload.notes },
      },
      activity: {
        targetId: payload.userId,
        targetType: 'user',
        activityType: 'suspend',
        description: 'User suspended',
        metadata: { reason: payload.reason },
      },
    });

    await enqueueJob(
      ctx.adminClient,
      {
        jobType: 'notification',
        payload: {
          eventType: 'UserSuspended',
          userId: payload.userId,
          reason: payload.reason,
          actorId: ctx.actor.id,
        },
      },
      ctx.logger,
    );

    return jsonSuccess({ userId: data.id, status: data.status });
  }),
);
