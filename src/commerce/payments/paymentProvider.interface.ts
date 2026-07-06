import type {
  PaymentCaptureRequest,
  PaymentCaptureResult,
  PaymentIntentRequest,
  PaymentIntentResult,
  PaymentProviderId,
  RefundPreparationRequest,
  RefundPreparationResult,
} from '../types/payment.types';

export interface PaymentProvider {
  readonly id: PaymentProviderId;
  createPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntentResult>;
  capturePayment(request: PaymentCaptureRequest): Promise<PaymentCaptureResult>;
  prepareRefund(request: RefundPreparationRequest): Promise<RefundPreparationResult>;
  verifyWebhookSignature?(_payload: string, _signature: string): boolean;
}
