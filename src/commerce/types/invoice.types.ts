import type { CommerceBuyerDetails, CommerceSellerDetails } from './common';
import type { TaxBreakdown } from './tax.types';
import type { OrderLineItem } from './order.types';
import type { CommerceCurrency } from './common';

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  lineTotal: number;
  hsnSac?: string;
}

export interface CommerceInvoice {
  invoiceNumber: string;
  orderNumber: string;
  orderId: string;
  issuedAt: string;
  currency: CommerceCurrency;
  seller: CommerceSellerDetails;
  buyer: CommerceBuyerDetails;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  discountAmount: number;
  tax: TaxBreakdown;
  totalAmount: number;
  notes?: string[];
}

export interface InvoicePdfPreparation {
  invoice: CommerceInvoice;
  templateId: string;
  storagePath: string;
  mimeType: 'application/pdf';
  preparedAt: string;
  downloadUrl?: string | null;
}

export interface GenerateInvoiceInput {
  orderId: string;
  orderNumber: string;
  buyer: CommerceBuyerDetails;
  items: OrderLineItem[];
  subtotal: number;
  discountAmount: number;
  tax: TaxBreakdown;
  totalAmount: number;
  currency: CommerceCurrency;
}
