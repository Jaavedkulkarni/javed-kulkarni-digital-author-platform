import type { DigitalFormat } from '../../types/database';
import type { CommerceOrderStatus } from './checkout.types';
import type { CommerceBuyerDetails, CommerceCurrency } from './common';

export interface OrderLineItem {
  id: string;
  bookId: string;
  title: string;
  format: DigitalFormat | null;
  unitPrice: number;
  quantity: number;
  discountAmount: number;
  taxAmount: number;
  lineTotal: number;
}

export interface CommerceOrder {
  id: string;
  orderNumber: string;
  userId: string;
  status: CommerceOrderStatus;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  currency: CommerceCurrency;
  couponCode: string | null;
  buyer: CommerceBuyerDetails;
  items: OrderLineItem[];
  placedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  metadata: Record<string, unknown>;
}

export interface CreateOrderPayload {
  userId: string;
  buyer: CommerceBuyerDetails;
  items: Omit<OrderLineItem, 'id'>[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: CommerceCurrency;
  couponCode?: string | null;
  metadata?: Record<string, unknown>;
}
