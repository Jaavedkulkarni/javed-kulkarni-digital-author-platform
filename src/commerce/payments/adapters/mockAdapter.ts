import type { PaymentProvider } from '../paymentProvider.interface';
import type {
  PaymentCaptureRequest,
  PaymentCaptureResult,
  PaymentIntentRequest,
  PaymentIntentResult,
  RefundPreparationRequest,
  RefundPreparationResult,
} from '../../types/payment.types';

function createIntentId(): string {
  return `mock_intent_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export class MockPaymentAdapter implements PaymentProvider {
  readonly id = 'mock' as const;

  async createPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntentResult> {
    return {
      provider: 'mock',
      providerPaymentId: createIntentId(),
      status: request.amount <= 0 ? 'captured' : 'pending',
      amount: request.amount,
      currency: request.currency,
      clientSecret: null,
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
      refundId: `mock_refund_${Date.now()}`,
      paymentId: request.paymentId,
      orderId: request.orderId,
      amount: request.amount,
      status: 'prepared',
      provider: 'mock',
      preparedAt: new Date().toISOString(),
    };
  }
}
