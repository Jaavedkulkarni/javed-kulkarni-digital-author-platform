import { InternalError } from '../_shared/errors/app-error.ts';
import { createEnterpriseHandler, emitDomainEventAndAudit } from '../_shared/handler-enterprise.ts';
import { enqueueJob } from '../_shared/jobs/queue.ts';
import {
  assertCanRestoreUser,
  assertProfileRestorable,
} from '../_shared/permissions/user-lifecycle.ts';
import { assertProfileExists } from '../_shared/permissions/checks.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import { clearSuspensionMetadata } from '../_shared/user-lifecycle/metadata.ts';
import { validateRestoreUserRequest } from '../_shared/validation/user-requests.ts';

Deno.serve(
  createEnterpriseHandler('restore-user', { permission: 'super_admin' }, async (ctx) => {
    const payload = validateRestoreUserRequest(ctx.body);
    const profile = await assertProfileExists(ctx.adminClient, payload.userId);

    await assertProfileRestorable(profile);
    await assertCanRestoreUser(ctx.adminClient, ctx.actor.id, payload.userId);

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

    await clearSuspensionMetadata(ctx.adminClient, payload.userId, payload.notes);

    await emitDomainEventAndAudit(ctx, {
      eventType: 'UserRestored',
      payload: { userId: payload.userId, notes: payload.notes },
      audit: {
        action: 'restore',
        entity: 'user',
        targetId: payload.userId,
        targetType: 'user',
        beforeState: profile as Record<string, unknown>,
        afterState: data as Record<string, unknown>,
        metadata: payload.notes ? { notes: payload.notes } : undefined,
      },
      activity: {
        targetId: payload.userId,
        targetType: 'user',
        activityType: 'restore',
        description: 'User restored',
        metadata: payload.notes ? { notes: payload.notes } : undefined,
      },
    });

    await enqueueJob(
      ctx.adminClient,
      {
        jobType: 'notification',
        payload: {
          eventType: 'UserRestored',
          userId: payload.userId,
          actorId: ctx.actor.id,
          notes: payload.notes,
        },
      },
      ctx.logger,
    );

    return jsonSuccess({ userId: data.id, status: data.status, deletedAt: data.deleted_at });
  }),
);
