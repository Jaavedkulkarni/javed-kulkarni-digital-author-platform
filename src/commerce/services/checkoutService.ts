import type { CheckoutEngine, CheckoutContext } from '../checkout/checkoutEngine';
import type { CompleteCheckoutInput, StartCheckoutInput } from '../types/checkout.types';
import type { PaymentProviderId } from '../types/payment.types';

export class CheckoutService {
  constructor(private readonly engine: CheckoutEngine) {}

  validateCart(userId: string) {
    return this.engine.validateCart(userId);
  }

  validateEntitlement(userId: string, context?: Parameters<CheckoutEngine['validateEntitlement']>[1]) {
    return this.engine.validateEntitlement(userId, context ?? { userId });
  }

  prepareOrder(session: Parameters<CheckoutEngine['prepareOrder']>[0]) {
    return this.engine.prepareOrder(session);
  }

  preparePaymentRequest(
    session: Parameters<CheckoutEngine['preparePaymentRequest']>[0],
    orderId: string,
    provider: PaymentProviderId = 'mock'
  ) {
    return this.engine.preparePaymentRequest(session, orderId, provider);
  }

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
