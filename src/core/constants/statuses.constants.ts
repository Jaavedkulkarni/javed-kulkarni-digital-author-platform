export const USER_STATUSES = ['active', 'pending', 'suspended'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const JOB_STATUSES = [
  'pending',
  'processing',
  'completed',
  'failed',
  'dead_letter',
  'scheduled',
  'cancelled',
] as const;

export const WEBHOOK_DELIVERY_STATUSES = ['pending', 'delivered', 'failed', 'retrying'] as const;

export const HEALTH_STATUSES = ['healthy', 'degraded', 'unhealthy'] as const;

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
] as const;

export const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'] as const;
