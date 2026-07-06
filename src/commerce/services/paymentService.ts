import type { CommercePaymentRepository } from '../repositories/paymentRepository';
import type { PaymentOrchestrator } from '../payments/paymentOrchestrator';
import type { OrderProcessor } from '../orders/orderProcessor';
import type {
  PaymentCaptureRequest,
  PaymentIntentRequest,
  PaymentProviderId,
  RefundPreparationRequest,
} from '../types/payment.types';

export class PaymentService {
  constructor(
    private readonly orchestrator: PaymentOrchestrator,
    private readonly paymentRepo: CommercePaymentRepository,
    private readonly orderProcessor: OrderProcessor
  ) {}

  async initiatePayment(request: PaymentIntentRequest) {
    return this.orchestrator.initiatePayment(request);
  }

  async capturePayment(
    provider: PaymentProviderId,
    request: PaymentCaptureRequest,
    orderId: string,
    currentOrderStatus: 'processing' | 'pending'
  ) {
    const result = await this.orchestrator.capturePayment(provider, request);
    await this.paymentRepo.updateStatus(request.paymentId, result.status);
    if (result.status === 'captured') {
      await this.orderProcessor.transition({
        orderId,
        currentStatus: currentOrderStatus,
        nextStatus: 'paid',
      });
    }
    return result;
  }

  async prepareRefund(provider: PaymentProviderId, request: RefundPreparationRequest) {
    return this.orchestrator.prepareRefund(provider, request);
  }

  async getPaymentsByOrder(orderId: string) {
    return this.paymentRepo.findByOrderId(orderId);
  }
}

export function createPaymentService(
  orchestrator: PaymentOrchestrator,
  paymentRepo: CommercePaymentRepository,
  orderProcessor: OrderProcessor
): PaymentService {
  return new PaymentService(orchestrator, paymentRepo, orderProcessor);
}
