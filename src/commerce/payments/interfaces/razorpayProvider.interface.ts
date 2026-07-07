import type { PaymentProvider } from '../paymentProvider.interface';

export interface RazorpayProvider extends PaymentProvider {
  readonly id: 'razorpay';
}

export interface StripeProvider extends PaymentProvider {
  readonly id: 'stripe';
}
