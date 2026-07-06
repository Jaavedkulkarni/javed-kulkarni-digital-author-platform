import type { CommerceCurrency } from './common';

export type PaymentProviderId = 'razorpay' | 'stripe' | 'mock';

export type CommercePaymentStatus =
  | 'pending'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export interface PaymentIntentRequest {
  orderId: string;
  userId: string;
  amount: number;
  currency: CommerceCurrency;
  provider: PaymentProviderId;
  metadata?: Record<string, unknown>;
}

export interface PaymentIntentResult {
  provider: PaymentProviderId;
  providerPaymentId: string;
  providerOrderId?: string | null;
  status: CommercePaymentStatus;
  amount: number;
  currency: CommerceCurrency;
  clientSecret?: string | null;
  checkoutUrl?: string | null;
}

export interface PaymentCaptureRequest {
  paymentId: string;
  providerPaymentId: string;
  amount: number;
}

export interface PaymentCaptureResult {
  paymentId: string;
  status: CommercePaymentStatus;
  capturedAt: string;
}

export interface RefundPreparationRequest {
  paymentId: string;
  orderId: string;
  amount: number;
  reason?: string;
}

export interface RefundPreparationResult {
  refundId: string;
  paymentId: string;
  orderId: string;
  amount: number;
  status: 'prepared';
  provider: PaymentProviderId;
  preparedAt: string;
}
