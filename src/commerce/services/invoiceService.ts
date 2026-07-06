import type { InvoiceGenerator } from '../invoice/invoiceGenerator';
import type { CommerceOrder } from '../types/order.types';
import type { CommerceInvoice, InvoicePdfPreparation } from '../types/invoice.types';
import type { TaxBreakdown } from '../types/tax.types';

export class InvoiceService {
  constructor(private readonly generator: InvoiceGenerator) {}

  generateFromOrder(order: CommerceOrder, tax: TaxBreakdown): CommerceInvoice {
    return this.generator.generate({
      orderId: order.id,
      orderNumber: order.orderNumber,
      buyer: order.buyer,
      items: order.items,
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      tax,
      totalAmount: order.totalAmount,
      currency: order.currency,
    });
  }

  preparePdf(invoice: CommerceInvoice): InvoicePdfPreparation {
    return this.generator.preparePdf(invoice);
  }
}

export function createInvoiceService(generator: InvoiceGenerator): InvoiceService {
  return new InvoiceService(generator);
}
