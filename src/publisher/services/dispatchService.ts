import {
  getDispatches,
  getDispatchByJobId,
  createDispatch as storeCreate,
  confirmDelivery as storeConfirm,
} from '../stores/dispatchStore';
import type { DispatchRecord } from '../types/dispatch.types';
import type { PublisherOperationResult } from '../types/common';
import { assertPublisherOwnership } from '../utils/security';

export class DispatchService {
  list(publisherId: string): DispatchRecord[] {
    return getDispatches(publisherId);
  }

  getByJobId(publisherId: string, jobId: string): DispatchRecord | null {
    const record = getDispatchByJobId(publisherId, jobId);
    if (!record || !assertPublisherOwnership(record.publisherId, publisherId)) return null;
    return record;
  }

  createDispatch(
    publisherId: string,
    input: {
      jobId: string;
      courier: string;
      trackingNumber: string;
      dispatchDate: string;
      expectedDelivery: string;
    }
  ): PublisherOperationResult<DispatchRecord> {
    const record = storeCreate(publisherId, input);
    return { success: true, data: record };
  }

  confirmDelivery(publisherId: string, dispatchId: string): PublisherOperationResult<DispatchRecord> {
    const record = storeConfirm(publisherId, dispatchId);
    if (!record) return { success: false, errors: ['Dispatch record not found.'] };
    return { success: true, data: record };
  }
}

export function createDispatchService(): DispatchService {
  return new DispatchService();
}
