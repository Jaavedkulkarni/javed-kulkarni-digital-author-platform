import type { CheckoutEngine, CheckoutContext } from '../checkout/checkoutEngine';
import type { CompleteCheckoutInput, StartCheckoutInput } from '../types/checkout.types';
import type { PaymentProviderId } from '../types/payment.types';

export class CheckoutService {
  constructor(private readonly engine: CheckoutEngine) {}

  start(input: StartCheckoutInput, context?: CheckoutContext) {
    return this.engine.startCheckout(input, context);
  }

  complete(input: CompleteCheckoutInput, provider: PaymentProviderId = 'mock') {
    return this.engine.completeCheckout(input, provider);
  }
}

export function createCheckoutService(engine: CheckoutEngine): CheckoutService {
  return new CheckoutService(engine);
}
