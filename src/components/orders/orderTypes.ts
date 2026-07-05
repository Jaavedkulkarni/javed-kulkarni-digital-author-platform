import type { BookFormat } from '../book/bookTypes';

export type OrderPaymentStatus = 'paid' | 'pending' | 'refunded' | 'failed';

export type OrderStatus = 'completed' | 'pending' | 'refunded' | 'cancelled';

/** Slim display model for OrderCard — public to orders module only. */
export interface OrderCardItem {
  id: string;
  title?: string;
  author?: string;
  coverUrl?: string | null;
  coverAlt?: string;
  orderNumber?: string;
  purchaseDate?: string;
  paymentStatus?: OrderPaymentStatus;
  orderStatus?: OrderStatus;
  amountPaid?: string;
}

/**
 * Internal future-ready detail model — not connected to APIs.
 * Sprint 04C placeholder fields for commerce integration.
 */
export interface OrderDetailView {
  id: string;
  orderNumber: string;
  invoiceNumber: string;
  bookTitle: string;
  author: string;
  language: string;
  category: string;
  format: BookFormat;
  purchaseDate: string;
  paymentMethod: string;
  paymentStatus: OrderPaymentStatus;
  orderStatus: OrderStatus;
  amountPaid: string;
  membershipPurchase: boolean;
  downloadAvailable: boolean;
  invoiceAvailable: boolean;
  supportAvailable: boolean;
  subtotal: string;
  discountAmount: string;
  gstPercent: string;
  gstAmount: string;
  grandTotal: string;
  transactionId: string;
  paymentReference: string;
  invoiceUrl: string | null;
  billingName: string;
  billingEmail: string;
  downloadLimit: number;
  downloadCount: number;
  membershipPlan: string | null;
  membershipExpiry: string | null;
}

export const PAYMENT_STATUS_LABELS: Record<OrderPaymentStatus, string> = {
  paid: 'Paid',
  pending: 'Pending',
  refunded: 'Refunded',
  failed: 'Failed',
};

export const PAYMENT_STATUS_STYLES: Record<OrderPaymentStatus, string> = {
  paid: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300',
  pending: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300',
  refunded: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/15 dark:text-sky-300',
  failed: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-300',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  completed: 'Completed',
  pending: 'Pending',
  refunded: 'Refunded',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  completed: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300',
  pending: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300',
  refunded: 'border-violet-200 bg-violet-100 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/15 dark:text-violet-300',
  cancelled: 'border-gray-200 bg-gray-100 text-gray-600 dark:border-navy-600 dark:bg-navy-700 dark:text-gray-400',
};

export type OrderViewMode = 'grid' | 'list';
