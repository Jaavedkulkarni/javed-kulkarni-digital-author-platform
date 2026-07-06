import type { Order, Tables } from '../../types/database';
import type { CommerceOrder, OrderLineItem } from '../types/order.types';
import type { CommerceAddress } from '../types/common';
import type { CommerceCurrency } from '../types/common';
import { mapDbStatusToCommerce } from '../workflow/orderWorkflow';

function parseAddress(json: unknown): CommerceAddress | undefined {
  if (!json || typeof json !== 'object') return undefined;
  const addr = json as Record<string, unknown>;
  return {
    line1: typeof addr.line1 === 'string' ? addr.line1 : undefined,
    line2: typeof addr.line2 === 'string' ? addr.line2 : undefined,
    city: typeof addr.city === 'string' ? addr.city : undefined,
    state: typeof addr.state === 'string' ? addr.state : undefined,
    country: typeof addr.country === 'string' ? addr.country : undefined,
    postalCode: typeof addr.postalCode === 'string' ? addr.postalCode : undefined,
  };
}

function mapOrderItem(row: Tables<'order_items'>): OrderLineItem {
  return {
    id: row.id,
    bookId: row.book_id,
    title: row.title_snapshot,
    format: row.format,
    unitPrice: Number(row.unit_price),
    quantity: row.quantity,
    discountAmount: Number(row.discount_amount),
    taxAmount: Number(row.tax_amount),
    lineTotal: Number(row.line_total),
  };
}

export function mapOrderRowToCommerceOrder(
  order: Order,
  items: Tables<'order_items'>[]
): CommerceOrder {
  const metadata =
    order.metadata && typeof order.metadata === 'object' && !Array.isArray(order.metadata)
      ? (order.metadata as Record<string, unknown>)
      : {};

  return {
    id: order.id,
    orderNumber: order.order_number,
    userId: order.user_id,
    status: mapDbStatusToCommerce(order.status),
    subtotal: Number(order.subtotal),
    discountAmount: Number(order.discount_amount),
    taxAmount: Number(order.tax_amount),
    shippingAmount: Number(order.shipping_amount),
    totalAmount: Number(order.total_amount),
    currency: order.currency as CommerceCurrency,
    couponCode: order.coupon_code,
    buyer: {
      userId: order.user_id,
      email: order.billing_email,
      name: order.billing_name,
      phone: order.billing_phone,
      billingAddress: parseAddress(order.billing_address),
    },
    items: items.map(mapOrderItem),
    placedAt: order.placed_at,
    completedAt: order.completed_at,
    cancelledAt: order.cancelled_at,
    metadata,
  };
}
