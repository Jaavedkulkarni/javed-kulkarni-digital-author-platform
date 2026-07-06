import type { CommerceCurrency } from './common';

export interface CommerceReceipt {
  receiptNumber: string;
  orderNumber: string;
  orderId: string;
  paymentId: string;
  paidAt: string;
  amount: number;
  currency: CommerceCurrency;
  paymentMethod: string;
  provider: string;
  buyerEmail: string;
  lineSummary: string[];
}

export interface GenerateReceiptInput {
  orderId: string;
  orderNumber: string;
  paymentId: string;
  amount: number;
  currency: CommerceCurrency;
  paymentMethod: string;
  provider: string;
  buyerEmail: string;
  itemTitles: string[];
}
