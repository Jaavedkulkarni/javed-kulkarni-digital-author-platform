import type { CommerceOrderStatus } from '../types/checkout.types';
import type { OrderStatus } from '../../types/database';

export const COMMERCE_ORDER_TRANSITIONS: Record<CommerceOrderStatus, CommerceOrderStatus[]> = {
  pending: ['processing', 'paid', 'failed', 'cancelled'],
  processing: ['paid', 'failed', 'cancelled'],
  paid: ['refunded'],
  failed: ['pending'],
  cancelled: [],
  refunded: [],
};

export function canTransitionOrder(from: CommerceOrderStatus, to: CommerceOrderStatus): boolean {
  return COMMERCE_ORDER_TRANSITIONS[from]?.includes(to) ?? false;
}

export function validateOrderTransition(
  from: CommerceOrderStatus,
  to: CommerceOrderStatus
): { allowed: boolean; error?: string } {
  if (from === to) return { allowed: true };
  if (!canTransitionOrder(from, to)) {
    return {
      allowed: false,
      error: `Order cannot transition from "${from}" to "${to}".`,
    };
  }
  return { allowed: true };
}

export function mapCommerceStatusToDb(status: CommerceOrderStatus): OrderStatus {
  if (status === 'paid') return 'completed';
  return status;
}

export function mapDbStatusToCommerce(status: OrderStatus): CommerceOrderStatus {
  if (status === 'completed') return 'paid';
  return status;
}
