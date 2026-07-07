import type { CommerceOrderStatus } from '../types/checkout.types';

export const COMMERCE_ORDER_STATES: CommerceOrderStatus[] = [
  'pending',
  'processing',
  'paid',
  'failed',
  'cancelled',
  'refunded',
] as const;

export const ORDER_STATE_LABELS: Record<CommerceOrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  paid: 'Paid',
  failed: 'Failed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};
