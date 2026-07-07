import { InternalError, NotFoundError } from '../_shared/errors/app-error.ts';
import { createEnterpriseHandler, emitDomainEventAndAudit } from '../_shared/handler-enterprise.ts';
import {
  BULK_SYNC_THRESHOLD,
  executeBulkOperation,
  getJobProgress,
  shouldRunBulkAsync,
  type BulkOperationPayload,
  type BulkUserOperation,
} from '../_shared/bulk/user-bulk-processor.ts';
import { enqueueJob, markJobCompleted } from '../_shared/jobs/queue.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import { validateBulkUsersRequest } from '../_shared/validation/bulk-requests.ts';

Deno.serve(
  createEnterpriseHandler('bulk-users', { permission: 'super_admin' }, async (ctx) => {
    const payload = validateBulkUsersRequest(ctx.body);

    if (payload.action === 'job_status') {
      const job = await getJobProgress(ctx.adminClient, payload.jobId!);
      if (!job) throw new NotFoundError('Job not found');
      return jsonSuccess({ jobId: payload.jobId, status: job.status, progress: job.progress, error: job.error });
    }

    if (payload.action === 'cancel_job') {
      await ctx.adminClient
        .from('background_jobs')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', payload.jobId!);
      return jsonSuccess({ jobId: payload.jobId, cancelled: true });
    }

    const operation = payload.operation as BulkUserOperation;
    const userIds = payload.userIds ?? [];
    const opPayload = (payload.payload ?? {}) as BulkOperationPayload;

    if (shouldRunBulkAsync(userIds.length)) {
      const jobId = await enqueueJob(
        ctx.adminClient,
        {
          jobType: 'notification',
          queue: 'user_bulk',
          payload: {
            operation,
            userIds,
            opPayload,
            actorId: ctx.actor.id,
            progress: { completed: 0, failed: 0, skipped: 0, total: userIds.length, results: [] },
          },
        },
        ctx.logger,
      );

      if (!jobId) throw new InternalError('Failed to enqueue bulk operation');

      void processBulkJob(ctx, jobId, operation, userIds, opPayload);

      return jsonSuccess({ async: true, jobId, total: userIds.length, threshold: BULK_SYNC_THRESHOLD });
    }

    const result = await executeBulkOperation(ctx, operation, userIds, opPayload);

    await emitDomainEventAndAudit(ctx, {
      eventType: 'UserUpdated',
      payload: {
        bulkOperation: operation,
        parentAuditId: result.parentAuditId,
        completed: result.progress.completed,
        failed: result.progress.failed,
        skipped: result.progress.skipped,
      },
      audit: {
        action: 'bulk_operation',
        entity: 'user',
        targetType: 'user',
        metadata: { operation, parentAuditId: result.parentAuditId, ...result.progress },
      },
      activity: {
        targetId: result.parentAuditId,
        targetType: 'bulk_operation',
        activityType: 'update',
        description: `Bulk ${operation.replace(/_/g, ' ')} completed`,
        metadata: result.progress as unknown as Record<string, unknown>,
      },
    });

    return jsonSuccess({
      async: false,
      parentAuditId: result.parentAuditId,
      progress: result.progress,
    });
  }),
);

async function processBulkJob(
  ctx: Parameters<typeof createEnterpriseHandler>[2] extends (c: infer C) => unknown ? C : never,
  jobId: string,
  operation: BulkUserOperation,
  userIds: string[],
  opPayload: BulkOperationPayload,
): Promise<void> {
  try {
    await ctx.adminClient.from('background_jobs').update({ status: 'processing' }).eq('id', jobId);
    const result = await executeBulkOperation(ctx, operation, userIds, opPayload);
    await ctx.adminClient
      .from('background_jobs')
      .update({
        status: 'completed',
        payload: { operation, userIds, progress: result.progress, parentAuditId: result.parentAuditId },
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId);
    await markJobCompleted(ctx.adminClient, jobId);
  } catch (error) {
    await ctx.adminClient
      .from('background_jobs')
      .update({
        status: 'failed',
        last_error: error instanceof Error ? error.message : 'Bulk job failed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId);
  }
}
