import { getRfqs, getRfqById } from '../stores/rfqStore';
import type { RfqRequest } from '../types/rfq.types';
import { assertPublisherOwnership } from '../utils/security';

export class RfqService {
  list(publisherId: string): RfqRequest[] {
    return getRfqs(publisherId);
  }

  getById(publisherId: string, rfqId: string): RfqRequest | null {
    const rfq = getRfqById(publisherId, rfqId);
    if (!rfq || !assertPublisherOwnership(rfq.publisherId, publisherId)) return null;
    return rfq;
  }

  listPending(publisherId: string): RfqRequest[] {
    const now = new Date();
    return getRfqs(publisherId).filter((r) => new Date(r.quoteDeadline) >= now);
  }

  listExpired(publisherId: string): RfqRequest[] {
    const now = new Date();
    return getRfqs(publisherId).filter((r) => new Date(r.quoteDeadline) < now);
  }
}

export function createRfqService(): RfqService {
  return new RfqService();
}
