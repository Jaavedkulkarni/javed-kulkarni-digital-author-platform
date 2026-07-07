import type { PaymentProvider } from '../paymentProvider.interface';

export interface StripeProvider extends PaymentProvider {
  readonly id: 'stripe';
}
