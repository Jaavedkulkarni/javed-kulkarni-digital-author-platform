import {
  getPaperbackRequests,
  getRfqs,
  getQuotes,
  getProductionTracking,
  createRfq,
  assignPublisher,
} from '../stores/paperbackStore';
import type { PlatformAdminOperationResult } from '../types/common';

export class PaperbackService {
  getRequests() { return getPaperbackRequests(); }
  getRfqs() { return getRfqs(); }
  getQuoteComparisons() { return getQuotes(); }
  getProductionTracking() { return getProductionTracking(); }

  createRfq(requestId: string): PlatformAdminOperationResult {
    const rfq = createRfq(requestId);
    return rfq ? { success: true, data: rfq } : { success: false, errors: ['Failed to create RFQ.'] };
  }

  assignPublisher(requestId: string, publisherName: string): PlatformAdminOperationResult {
    const result = assignPublisher(requestId, publisherName);
    return result ? { success: true, data: result } : { success: false, errors: ['Assignment failed.'] };
  }
}

export function createPaperbackService(): PaperbackService {
  return new PaperbackService();
}
