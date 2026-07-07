import type { CommerceOrderStatus } from '../types/checkout.types';
import type { OrderProcessor } from './orderProcessor';
import type { CreateOrderPayload, CommerceOrder } from '../types/order.types';
import {
  canTransitionOrder,
  validateOrderTransition,
  COMMERCE_ORDER_TRANSITIONS,
} from '../workflow/orderWorkflow';
import { COMMERCE_ORDER_STATES } from '../constants/order.constants';

export { COMMERCE_ORDER_STATES };

export class OrderEngine {
  constructor(private readonly processor: OrderProcessor) {}

  getStates(): CommerceOrderStatus[] {
    return [...COMMERCE_ORDER_STATES];
  }

  getTransitions(): Record<CommerceOrderStatus, CommerceOrderStatus[]> {
    return { ...COMMERCE_ORDER_TRANSITIONS };
  }

  canTransition(from: CommerceOrderStatus, to: CommerceOrderStatus): boolean {
    return canTransitionOrder(from, to);
  }

  validateTransition(from: CommerceOrderStatus, to: CommerceOrderStatus) {
    return validateOrderTransition(from, to);
  }

  createOrder(payload: CreateOrderPayload): Promise<CommerceOrder> {
    return this.processor.createOrder(payload);
  }

  transition(input: Parameters<OrderProcessor['transition']>[0]): Promise<CommerceOrder> {
    return this.processor.transition(input);
  }

  getOrder(orderId: string): Promise<CommerceOrder | null> {
    return this.processor.getOrder(orderId);
  }

  getOrdersByUser(userId: string): Promise<CommerceOrder[]> {
    return this.processor.getOrdersByUser(userId);
  }
}

export function createOrderEngine(processor: OrderProcessor): OrderEngine {
  return new OrderEngine(processor);
}
