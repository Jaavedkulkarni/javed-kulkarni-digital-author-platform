import {
  getProductionJobs,
  getProductionJobById,
  updateJobStatus as storeUpdateStatus,
} from '../stores/productionJobStore';
import type { ProductionJob } from '../types/production.types';
import type { ProductionJobStatus, PublisherOperationResult } from '../types/common';
import { assertPublisherOwnership } from '../utils/security';
import { canTransitionProductionStatus } from '../utils/workflow';

export class ProductionJobService {
  list(publisherId: string): ProductionJob[] {
    return getProductionJobs(publisherId).filter((j) => j.assignedBy === 'authoros');
  }

  getById(publisherId: string, jobId: string): ProductionJob | null {
    const job = getProductionJobById(publisherId, jobId);
    if (!job || !assertPublisherOwnership(job.publisherId, publisherId)) return null;
    return job;
  }

  listByStatus(publisherId: string, status: ProductionJobStatus): ProductionJob[] {
    return this.list(publisherId).filter((j) => j.status === status);
  }

  listTodays(publisherId: string): ProductionJob[] {
    const today = new Date().toISOString().slice(0, 10);
    return this.list(publisherId).filter((j) => j.assignedDate.slice(0, 10) === today);
  }

  advanceStatus(
    publisherId: string,
    jobId: string,
    nextStatus: ProductionJobStatus
  ): PublisherOperationResult<ProductionJob> {
    const job = this.getById(publisherId, jobId);
    if (!job) return { success: false, errors: ['Production job not found.'] };
    if (!canTransitionProductionStatus(job.status, nextStatus)) {
      return { success: false, errors: [`Cannot transition from ${job.status} to ${nextStatus}.`] };
    }
    const updated = storeUpdateStatus(publisherId, jobId, nextStatus);
    if (!updated) return { success: false, errors: ['Failed to update job status.'] };
    return { success: true, data: updated };
  }
}

export function createProductionJobService(): ProductionJobService {
  return new ProductionJobService();
}
