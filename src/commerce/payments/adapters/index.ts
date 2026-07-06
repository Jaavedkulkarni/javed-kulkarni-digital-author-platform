import type { PaymentProviderId } from '../../types/payment.types';
import type { PaymentProvider } from '../paymentProvider.interface';
import { MockPaymentAdapter } from './mockAdapter';
import { RazorpayAdapter } from './razorpayAdapter';
import { StripeAdapter } from './stripeAdapter';

export { MockPaymentAdapter } from './mockAdapter';
export { RazorpayAdapter } from './razorpayAdapter';
export { StripeAdapter } from './stripeAdapter';

export function createPaymentAdapters(): Record<PaymentProviderId, PaymentProvider> {
  return {
    mock: new MockPaymentAdapter(),
    razorpay: new RazorpayAdapter(),
    stripe: new StripeAdapter(),
  };
}
