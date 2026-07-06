import type { ReturnStatus } from './common';

export interface DispatchRecord {
  id: string;
  jobId: string;
  publisherId: string;
  courier: string;
  trackingNumber: string;
  dispatchDate: string;
  expectedDelivery: string;
  deliveredAt: string | null;
  deliveryConfirmed: boolean;
  returnStatus: ReturnStatus;
}
