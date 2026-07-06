import type { OrderProcessor } from '../orders/orderProcessor';
import type { ReceiptGenerator } from '../orders/receiptGenerator';
import type { RefundPreparationService } from '../orders/refundPreparation';
import type { CommerceOrder } from '../types/order.types';
import type { CommerceOrderStatus } from '../types/checkout.types';
import type { PaymentProviderId } from '../types/payment.types';

export class OrderService {
  constructor(
    private readonly processor: OrderProcessor,
    private readonly receiptGenerator: ReceiptGenerator,
    private readonly refundPreparation: RefundPreparationService
  ) {}

  async getById(orderId: string): Promise<CommerceOrder | null> {
    return this.processor.getOrder(orderId);
  }

  async listByUser(userId: string): Promise<CommerceOrder[]> {
    return this.processor.getOrdersByUser(userId);
  }

  async transitionStatus(
    orderId: string,
    currentStatus: CommerceOrderStatus,
    nextStatus: CommerceOrderStatus
  ): Promise<CommerceOrder> {
    return this.processor.transition({ orderId, currentStatus, nextStatus });
  }

  generateReceipt(input: Parameters<ReceiptGenerator['generate']>[0]) {
    return this.receiptGenerator.generate(input);
  }

  prepareRefund(input: {
    orderId: string;
    paymentId: string;
    providerPaymentId: string;
    provider: PaymentProviderId;
    amount: number;
    currentOrderStatus: CommerceOrderStatus;
    reason?: string;
  }) {
    return this.refundPreparation.prepare(input);
  }
}

export function createOrderService(
  processor: OrderProcessor,
  receiptGenerator: ReceiptGenerator,
  refundPreparation: RefundPreparationService
): OrderService {
  return new OrderService(processor, receiptGenerator, refundPreparation);
}
