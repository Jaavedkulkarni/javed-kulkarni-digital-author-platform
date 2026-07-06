import type { PaymentProvider } from './paymentProvider.interface';
import type {
  PaymentCaptureRequest,
  PaymentIntentRequest,
  PaymentProviderId,
  RefundPreparationRequest,
} from '../types/payment.types';
import { createPaymentAdapters } from './adapters';

export class PaymentOrchestrator {
  private readonly providers: Record<PaymentProviderId, PaymentProvider>;

  constructor(providers?: Record<PaymentProviderId, PaymentProvider>) {
    this.providers = providers ?? createPaymentAdapters();
  }

  getProvider(id: PaymentProviderId): PaymentProvider {
    const provider = this.providers[id];
    if (!provider) throw new Error(`Payment provider "${id}" is not registered.`);
    return provider;
  }

  async initiatePayment(request: PaymentIntentRequest) {
    const provider = this.getProvider(request.provider);
    return provider.createPaymentIntent(request);
  }

  async capturePayment(providerId: PaymentProviderId, request: PaymentCaptureRequest) {
    return this.getProvider(providerId).capturePayment(request);
  }

  async prepareRefund(providerId: PaymentProviderId, request: RefundPreparationRequest) {
    return this.getProvider(providerId).prepareRefund(request);
  }
}

export function createPaymentOrchestrator(
  providers?: Record<PaymentProviderId, PaymentProvider>
): PaymentOrchestrator {
  return new PaymentOrchestrator(providers);
}
