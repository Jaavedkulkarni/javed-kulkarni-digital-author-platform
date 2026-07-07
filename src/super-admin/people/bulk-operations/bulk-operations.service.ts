import { invokeEdgeFunctionOrThrow } from '../../../lib/edge-functions';
import { createIdempotencyKey } from '../../../enterprise/idempotency/idempotency-key';
import type {
  BulkOperationPayload,
  BulkOperationType,
  BulkUsersApiResponse,
} from './bulk-operations.types';

export class BulkOperationsService {
  execute(operation: BulkOperationType, userIds: string[], payload?: BulkOperationPayload) {
    return invokeEdgeFunctionOrThrow<BulkUsersApiResponse>(
      'bulk-users',
      { action: 'execute', operation, userIds, payload: payload ?? {} },
      { idempotencyKey: createIdempotencyKey('bulk-users') },
    );
  }

  getJobStatus(jobId: string) {
    return invokeEdgeFunctionOrThrow<BulkUsersApiResponse & { status?: string; error?: string }>(
      'bulk-users',
      { action: 'job_status', jobId },
      { idempotencyKey: createIdempotencyKey('bulk-users-status') },
    );
  }

  cancelJob(jobId: string) {
    return invokeEdgeFunctionOrThrow<{ cancelled: boolean }>(
      'bulk-users',
      { action: 'cancel_job', jobId },
      { idempotencyKey: createIdempotencyKey('bulk-users-cancel') },
    );
  }
}

let bulkOperationsService: BulkOperationsService | null = null;

export function getBulkOperationsService(): BulkOperationsService {
  if (!bulkOperationsService) bulkOperationsService = new BulkOperationsService();
  return bulkOperationsService;
}
