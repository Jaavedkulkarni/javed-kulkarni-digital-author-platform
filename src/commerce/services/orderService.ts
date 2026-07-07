import type { OrderEngine } from '../orders/orderEngine';
import type { ReceiptGenerator } from '../orders/receiptGenerator';
import type { RefundPreparationService } from '../orders/refundPreparation';
import type { CommerceOrder } from '../types/order.types';
import type { CommerceOrderStatus } from '../types/checkout.types';
import type { PaymentProviderId } from '../types/payment.types';
import { COMMERCE_ORDER_STATES } from '../constants/order.constants';

export class OrderService {
  constructor(
    private readonly engine: OrderEngine,
    private readonly receiptGenerator: ReceiptGenerator,
    private readonly refundPreparation: RefundPreparationService
  ) {}

  getStates(): CommerceOrderStatus[] {
    return this.engine.getStates();
  }

  canTransition(from: CommerceOrderStatus, to: CommerceOrderStatus): boolean {
    return this.engine.canTransition(from, to);
  }

  async getById(orderId: string): Promise<CommerceOrder | null> {
    return this.engine.getOrder(orderId);
  }

  async listByUser(userId: string): Promise<CommerceOrder[]> {
    return this.engine.getOrdersByUser(userId);
  }

  async transitionStatus(
    orderId: string,
    currentStatus: CommerceOrderStatus,
    nextStatus: CommerceOrderStatus
  ): Promise<CommerceOrder> {
    return this.engine.transition({ orderId, currentStatus, nextStatus });
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
  engine: OrderEngine,
  receiptGenerator: ReceiptGenerator,
  refundPreparation: RefundPreparationService
): OrderService {
  return new OrderService(engine, receiptGenerator, refundPreparation);
}

export { COMMERCE_ORDER_STATES };
