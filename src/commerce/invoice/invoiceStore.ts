import type { CommerceInvoice } from '../types/invoice.types';

let invoiceStoreInstance: InvoiceStore | null = null;

export class InvoiceStore {
  private byOrderId = new Map<string, CommerceInvoice>();
  private byInvoiceNumber = new Map<string, CommerceInvoice>();

  save(invoice: CommerceInvoice): CommerceInvoice {
    this.byOrderId.set(invoice.orderId, invoice);
    this.byInvoiceNumber.set(invoice.invoiceNumber, invoice);
    return invoice;
  }

  findByOrderId(orderId: string): CommerceInvoice | null {
    return this.byOrderId.get(orderId) ?? null;
  }

  findByInvoiceNumber(invoiceNumber: string): CommerceInvoice | null {
    return this.byInvoiceNumber.get(invoiceNumber) ?? null;
  }

  listByUser(userId: string): CommerceInvoice[] {
    return [...this.byOrderId.values()].filter((invoice) => invoice.buyer.userId === userId);
  }
}

export function getInvoiceStore(): InvoiceStore {
  if (!invoiceStoreInstance) invoiceStoreInstance = new InvoiceStore();
  return invoiceStoreInstance;
}

export function resetInvoiceStore(): void {
  invoiceStoreInstance = null;
}
