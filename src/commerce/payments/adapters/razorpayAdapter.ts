import type { RazorpayProvider } from '../interfaces/razorpayProvider.interface';
import type {
  PaymentCaptureRequest,
  PaymentCaptureResult,
  PaymentIntentRequest,
  PaymentIntentResult,
  RefundPreparationRequest,
  RefundPreparationResult,
} from '../../types/payment.types';

function createIntentId(): string {
  return `razorpay_intent_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export class RazorpayAdapter implements RazorpayProvider {
  readonly id = 'razorpay' as const;

  async createPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntentResult> {
    return {
      provider: 'razorpay',
      providerPaymentId: createIntentId(),
      providerOrderId: `order_${request.orderId}`,
      status: 'pending',
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
      refundId: `rzp_refund_prep_${Date.now()}`,
      paymentId: request.paymentId,
      orderId: request.orderId,
      amount: request.amount,
      status: 'prepared',
      provider: 'razorpay',
      preparedAt: new Date().toISOString(),
    };
  }

  verifyWebhookSignature(): boolean {
    return false;
  }
}
