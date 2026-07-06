import type { TablesInsert } from '../../types/database';
import type { CommerceOrderRepository } from '../repositories/orderRepository';
import type { CommerceOrderItemsRepository } from '../repositories/orderItemsRepository';
import type { CommerceOrder, CreateOrderPayload } from '../types/order.types';
import type { CommerceOrderStatus } from '../types/checkout.types';
import { validateOrderTransition } from '../workflow/orderWorkflow';
import { mapOrderRowToCommerceOrder } from './orderMapper';
import { roundMoney } from '../utils/money';

export interface TransitionOrderInput {
  orderId: string;
  currentStatus: CommerceOrderStatus;
  nextStatus: CommerceOrderStatus;
}

export class OrderProcessor {
  constructor(
    private readonly orderRepo: CommerceOrderRepository,
    private readonly orderItemsRepo: CommerceOrderItemsRepository
  ) {}

  async createOrder(payload: CreateOrderPayload): Promise<CommerceOrder> {
    const orderInsert: TablesInsert<'orders'> = {
      user_id: payload.userId,
      status: 'pending',
      subtotal: payload.subtotal,
      discount_amount: payload.discountAmount,
      tax_amount: payload.taxAmount,
      shipping_amount: 0,
      total_amount: payload.totalAmount,
      currency: payload.currency,
      billing_email: payload.buyer.email,
      billing_name: payload.buyer.name ?? null,
      billing_phone: payload.buyer.phone ?? null,
      billing_address: payload.buyer.billingAddress ?? {},
      shipping_address: payload.buyer.billingAddress ?? {},
      coupon_code: payload.couponCode ?? null,
      placed_at: new Date().toISOString(),
      metadata: {
        ...payload.metadata,
        libraryAcquisitionPending: true,
      },
    };

    const order = await this.orderRepo.createOrder(orderInsert);

    const itemInserts: TablesInsert<'order_items'>[] = payload.items.map((item) => ({
      order_id: order.id,
      book_id: item.bookId,
      format: item.format,
      title_snapshot: item.title,
      unit_price: item.unitPrice,
      quantity: item.quantity,
      discount_amount: item.discountAmount,
      tax_amount: item.taxAmount,
      line_total: roundMoney(item.lineTotal, payload.currency),
    }));

    const items = await this.orderItemsRepo.createItems(itemInserts);
    return mapOrderRowToCommerceOrder(order, items);
  }

  async transition(input: TransitionOrderInput): Promise<CommerceOrder> {
    const validation = validateOrderTransition(input.currentStatus, input.nextStatus);
    if (!validation.allowed) {
      throw new Error(validation.error ?? 'Invalid order transition.');
    }

    const order = await this.orderRepo.updateStatus(input.orderId, input.nextStatus);
    const items = await this.orderItemsRepo.findByOrderId(order.id);
    return mapOrderRowToCommerceOrder(order, items);
  }

  async getOrder(orderId: string): Promise<CommerceOrder | null> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) return null;
    const items = await this.orderItemsRepo.findByOrderId(orderId);
    return mapOrderRowToCommerceOrder(order, items);
  }

  async getOrdersByUser(userId: string): Promise<CommerceOrder[]> {
    const orders = await this.orderRepo.findByUser(userId);
    const results: CommerceOrder[] = [];
    for (const order of orders) {
      const items = await this.orderItemsRepo.findByOrderId(order.id);
      results.push(mapOrderRowToCommerceOrder(order, items));
    }
    return results;
  }
}

export function createOrderProcessor(
  orderRepo: CommerceOrderRepository,
  orderItemsRepo: CommerceOrderItemsRepository
): OrderProcessor {
  return new OrderProcessor(orderRepo, orderItemsRepo);
}
