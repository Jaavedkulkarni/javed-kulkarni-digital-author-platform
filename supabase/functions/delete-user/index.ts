import { InternalError } from '../_shared/errors/app-error.ts';
import { createEnterpriseHandler, emitDomainEventAndAudit } from '../_shared/handler-enterprise.ts';
import { enqueueJob } from '../_shared/jobs/queue.ts';
import {
  assertCanDeleteUser,
  assertProfileDeletable,
} from '../_shared/permissions/user-lifecycle.ts';
import { assertProfileExists } from '../_shared/permissions/checks.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import { writeDeletionMetadata } from '../_shared/user-lifecycle/metadata.ts';
import { validateDeleteUserRequest } from '../_shared/validation/user-requests.ts';

Deno.serve(
  createEnterpriseHandler('delete-user', { permission: 'super_admin' }, async (ctx) => {
    const payload = validateDeleteUserRequest(ctx.body);

    const { data: profile, error: readError } = await ctx.adminClient
      .from('profiles')
      .select('id, status, deleted_at, email, full_name')
      .eq('id', payload.userId)
      .maybeSingle();

    if (readError || !profile) {
      throw new InternalError(readError?.message ?? 'User profile not found');
    }

    await assertProfileDeletable(profile);
    await assertCanDeleteUser(ctx.adminClient, ctx.actor.id, payload.userId);

    const deletedAt = new Date().toISOString();
    const previousStatus = profile.status;

    const { data, error } = await ctx.adminClient
      .from('profiles')
      .update({
        deleted_at: deletedAt,
        status: 'deleted',
        updated_at: deletedAt,
      })
      .eq('id', payload.userId)
      .select('id, status, deleted_at')
      .single();

    if (error || !data) throw new InternalError(error?.message ?? 'Failed to delete user');

    await writeDeletionMetadata(
      ctx.adminClient,
      payload.userId,
      ctx.actor.id,
      {
        reason: payload.reason,
        notes: payload.notes,
        previousStatus,
      },
      deletedAt,
    );

    await emitDomainEventAndAudit(ctx, {
      eventType: 'UserDeleted',
      payload: {
        userId: payload.userId,
        reason: payload.reason,
        notes: payload.notes,
        previousStatus,
      },
      audit: {
        action: 'delete',
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
        activityType: 'delete',
        description: 'User deleted',
        metadata: { reason: payload.reason, softDelete: true },
      },
    });

    await enqueueJob(
      ctx.adminClient,
      {
        jobType: 'notification',
        payload: {
          eventType: 'UserDeleted',
          userId: payload.userId,
          reason: payload.reason,
          actorId: ctx.actor.id,
        },
      },
      ctx.logger,
    );

    return jsonSuccess({ userId: data.id, status: data.status, deletedAt: data.deleted_at });
  }),
);
