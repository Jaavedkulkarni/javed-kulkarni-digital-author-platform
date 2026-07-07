import type { CommerceInvoice } from '../types/invoice.types';
import { getInvoiceStore, InvoiceStore } from '../invoice/invoiceStore';

export class CommerceInvoiceRepository {
  constructor(private readonly store: InvoiceStore = getInvoiceStore()) {}

  save(invoice: CommerceInvoice): CommerceInvoice {
    return this.store.save(invoice);
  }

  findByOrderId(orderId: string): CommerceInvoice | null {
    return this.store.findByOrderId(orderId);
  }

  findByInvoiceNumber(invoiceNumber: string): CommerceInvoice | null {
    return this.store.findByInvoiceNumber(invoiceNumber);
  }

  listByUser(userId: string): CommerceInvoice[] {
    return this.store.listByUser(userId);
  }
}

export function createCommerceInvoiceRepository(store?: InvoiceStore): CommerceInvoiceRepository {
  return new CommerceInvoiceRepository(store);
}
