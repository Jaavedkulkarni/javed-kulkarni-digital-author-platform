import type { DigitalFormat } from '../../types/database';

export type EntitlementSource = 'purchase' | 'membership' | 'gift' | 'promotion' | 'admin';

export interface LibraryEntitlement {
  id: string;
  userId: string;
  bookId: string;
  format: DigitalFormat;
  source: EntitlementSource;
  orderId: string | null;
  orderItemId: string | null;
  expiresAt: string | null;
  grantedAt: string;
}

export interface GrantEntitlementInput {
  userId: string;
  bookId: string;
  format: DigitalFormat;
  source: EntitlementSource;
  orderId?: string;
  orderItemId?: string;
  expiresAt?: string | null;
}

export interface EntitlementCheckResult {
  entitled: boolean;
  entitlement: LibraryEntitlement | null;
}

export interface FulfillmentInput {
  orderId: string;
  userId: string;
}

export interface FulfillmentResult {
  orderId: string;
  entitlementsGranted: LibraryEntitlement[];
  invoiceId: string | null;
  completed: boolean;
  errors?: string[];
}
