import type { InvoiceGenerator } from '../invoice/invoiceGenerator';
import type { CommerceInvoiceRepository } from '../repositories/invoiceRepository';
import type { CommerceOrder } from '../types/order.types';
import type { CommerceInvoice, GenerateInvoiceInput, InvoicePdfPreparation } from '../types/invoice.types';
import type { TaxBreakdown } from '../types/tax.types';

export class InvoiceService {
  constructor(
    private readonly generator: InvoiceGenerator,
    private readonly repo: CommerceInvoiceRepository
  ) {}

  generate(input: GenerateInvoiceInput): CommerceInvoice {
    const invoice = this.generator.generate(input);
    return this.repo.save(invoice);
  }

  generateFromOrder(order: CommerceOrder, tax: TaxBreakdown): CommerceInvoice {
    return this.generate({
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

  findByOrderId(orderId: string): CommerceInvoice | null {
    return this.repo.findByOrderId(orderId);
  }

  findByInvoiceNumber(invoiceNumber: string): CommerceInvoice | null {
    return this.repo.findByInvoiceNumber(invoiceNumber);
  }

  listByUser(userId: string): CommerceInvoice[] {
    return this.repo.listByUser(userId);
  }

  preparePdf(invoice: CommerceInvoice): InvoicePdfPreparation {
    return this.generator.preparePdf(invoice);
  }
}

export function createInvoiceService(
  generator: InvoiceGenerator,
  repo: CommerceInvoiceRepository
): InvoiceService {
  return new InvoiceService(generator, repo);
}
