import type { StripeProvider } from '../interfaces/stripeProvider.interface';
import type {
  PaymentCaptureRequest,
  PaymentCaptureResult,
  PaymentIntentRequest,
  PaymentIntentResult,
  RefundPreparationRequest,
  RefundPreparationResult,
} from '../../types/payment.types';

function createIntentId(): string {
  return `stripe_intent_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export class StripeAdapter implements StripeProvider {
  readonly id = 'stripe' as const;

  async createPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntentResult> {
    return {
      provider: 'stripe',
      providerPaymentId: createIntentId(),
      status: 'pending',
      amount: request.amount,
      currency: request.currency,
      clientSecret: `pi_mock_secret_${request.orderId}`,
      checkoutUrl: null,
    };
  }

  async capturePayment(request: PaymentCaptureRequest): Promise<PaymentCaptureResult> {
    return {
      paymentId: request.paymentId,
      status: 'captured',
      capturedAt: new Date().toISOString(),
    };
  }

  async prepareRefund(request: RefundPreparationRequest): Promise<RefundPreparationResult> {
    return {
      refundId: `stripe_refund_prep_${Date.now()}`,
      paymentId: request.paymentId,
      orderId: request.orderId,
      amount: request.amount,
      status: 'prepared',
      provider: 'stripe',
      preparedAt: new Date().toISOString(),
    };
  }

  verifyWebhookSignature(): boolean {
    return false;
  }
}
