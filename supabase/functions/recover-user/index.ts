import { InternalError } from '../_shared/errors/app-error.ts';
import { createEnterpriseHandler, emitDomainEventAndAudit } from '../_shared/handler-enterprise.ts';
import { enqueueJob } from '../_shared/jobs/queue.ts';
import {
  assertCanRecoverUser,
  assertProfileRecoverable,
} from '../_shared/permissions/user-lifecycle.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import {
  clearDeletionMetadata,
  readDeletionPreviousStatus,
} from '../_shared/user-lifecycle/metadata.ts';
import { validateRecoverUserRequest } from '../_shared/validation/user-requests.ts';

Deno.serve(
  createEnterpriseHandler('recover-user', { permission: 'super_admin' }, async (ctx) => {
    const payload = validateRecoverUserRequest(ctx.body);

    const { data: profile, error: readError } = await ctx.adminClient
      .from('profiles')
      .select('id, status, deleted_at, email, full_name')
      .eq('id', payload.userId)
      .maybeSingle();

    if (readError || !profile) {
      throw new InternalError(readError?.message ?? 'User profile not found');
    }

    await assertProfileRecoverable(profile);
    await assertCanRecoverUser(ctx.adminClient, ctx.actor.id, payload.userId);

    const restoredStatus = await readDeletionPreviousStatus(ctx.adminClient, payload.userId);
    const recoveredAt = new Date().toISOString();

    const { data, error } = await ctx.adminClient
      .from('profiles')
      .update({
        deleted_at: null,
        status: restoredStatus,
        updated_at: recoveredAt,
      })
      .eq('id', payload.userId)
      .select('id, status, deleted_at')
      .single();

    if (error || !data) throw new InternalError(error?.message ?? 'Failed to recover user');

    await clearDeletionMetadata(ctx.adminClient, payload.userId, payload.notes);

    await emitDomainEventAndAudit(ctx, {
      eventType: 'UserUpdated',
      payload: {
        userId: payload.userId,
        notes: payload.notes,
        recovered: true,
        restoredStatus,
      },
      audit: {
        action: 'restore',
        entity: 'user',
        targetId: payload.userId,
        targetType: 'user',
        beforeState: profile as Record<string, unknown>,
        afterState: data as Record<string, unknown>,
        metadata: payload.notes ? { notes: payload.notes, softDeleteRecovery: true } : { softDeleteRecovery: true },
      },
      activity: {
        targetId: payload.userId,
        targetType: 'user',
        activityType: 'restore',
        description: 'User recovered',
        metadata: { softDeleteRecovery: true, restoredStatus },
      },
    });

    await enqueueJob(
      ctx.adminClient,
      {
        jobType: 'notification',
        payload: {
          eventType: 'UserRecovered',
          userId: payload.userId,
          actorId: ctx.actor.id,
          notes: payload.notes,
          restoredStatus,
        },
      },
      ctx.logger,
    );

    return jsonSuccess({
      userId: data.id,
      status: data.status,
      deletedAt: data.deleted_at,
      restoredStatus,
    });
  }),
);
