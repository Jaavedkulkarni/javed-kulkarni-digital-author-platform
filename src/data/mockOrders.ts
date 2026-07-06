import type { BookFormat } from '../components/book/bookTypes';
import type { OrderPaymentStatus, OrderStatus } from '../components/orders/orderTypes';

export interface MockOrder {
  id: string;
  orderNumber: string;
  invoiceNumber: string;
  bookId: string;
  bookTitle: string;
  author: string;
  cover: string | null;
  language: string;
  category: string;
  format: BookFormat;
  purchaseDate: string;
  paymentMethod: string;
  paymentStatus: OrderPaymentStatus;
  orderStatus: OrderStatus;
  amount: number;
  discount: number;
  gst: number;
  membershipPurchase: boolean;
  downloadAvailable: boolean;
  downloadCount: number;
  invoiceAvailable: boolean;
  supportAvailable: boolean;
  lastDownloadedAt: string | null;
}

/** Synced at runtime by reader data layer (used by frozen Orders UI detail drawer). */
export const MOCK_ORDERS: MockOrder[] = [];
