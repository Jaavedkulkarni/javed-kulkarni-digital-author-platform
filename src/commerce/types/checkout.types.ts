import type { CommerceAddress, CommerceBuyerDetails, CommerceCurrency } from './common';
import type { CartSnapshot } from './cart.types';
import type { PricingBreakdown } from './pricing.types';
import type { TaxBreakdown } from './tax.types';
import type { OrderLineItem } from './order.types';
import type { PaymentProviderId } from './payment.types';

export type CommerceOrderStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export interface CheckoutSession {
  id: string;
  userId: string;
  cart: CartSnapshot;
  buyer: CommerceBuyerDetails;
  pricing: PricingBreakdown;
  tax: TaxBreakdown;
  couponCode?: string | null;
  currency: CommerceCurrency;
  guestCheckout: false;
  createdAt: string;
  expiresAt: string;
}

export interface StartCheckoutInput {
  userId: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  billingAddress?: CommerceAddress;
  couponCode?: string | null;
  regionCode?: string;
}

export interface CompleteCheckoutInput {
  sessionId: string;
  paymentProvider?: string;
}

export interface CheckoutResult {
  orderId: string;
  orderNumber: string;
  paymentId: string;
  status: CommerceOrderStatus;
  totalAmount: number;
  currency: CommerceCurrency;
}

export interface EntitlementValidationContext {
  userId: string;
  alreadyOwnsBookIds?: string[];
  hasActiveMembership?: boolean;
}

export interface PreparedOrderPayload {
  userId: string;
  buyer: CommerceBuyerDetails;
  items: Omit<OrderLineItem, 'id'>[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: CommerceCurrency;
  couponCode?: string | null;
  metadata?: Record<string, unknown>;
}

export interface PreparedPaymentRequest {
  orderId: string;
  userId: string;
  amount: number;
  currency: CommerceCurrency;
  provider: PaymentProviderId;
  metadata?: Record<string, unknown>;
}
