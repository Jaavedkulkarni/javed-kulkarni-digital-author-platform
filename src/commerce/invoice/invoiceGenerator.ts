import type { GenerateInvoiceInput, CommerceInvoice, InvoiceLineItem, InvoicePdfPreparation } from '../types/invoice.types';
import { DEFAULT_SELLER } from '../constants/commerce.constants';
import { generateInvoiceNumber } from './invoiceNumber';

export function buildInvoice(input: GenerateInvoiceInput): CommerceInvoice {
  const lineItems: InvoiceLineItem[] = input.items.map((item) => ({
    description: item.title,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    discountAmount: item.discountAmount,
    taxAmount: item.taxAmount,
    lineTotal: item.lineTotal,
    hsnSac: '49019900',
  }));

  return {
    invoiceNumber: generateInvoiceNumber(input.orderNumber),
    orderNumber: input.orderNumber,
    orderId: input.orderId,
    issuedAt: new Date().toISOString(),
    currency: input.currency,
    seller: DEFAULT_SELLER,
    buyer: input.buyer,
    lineItems,
    subtotal: input.subtotal,
    discountAmount: input.discountAmount,
    tax: input.tax,
    totalAmount: input.totalAmount,
    notes: ['This is a computer-generated invoice. GST is applicable as per Indian tax regulations.'],
  };
}

export function prepareInvoicePdf(invoice: CommerceInvoice): InvoicePdfPreparation {
  const storagePath = `invoices/${invoice.orderId}/${invoice.invoiceNumber}.pdf`;
  return {
    invoice,
    templateId: 'authoros-invoice-v1',
    storagePath,
    mimeType: 'application/pdf',
    preparedAt: new Date().toISOString(),
    downloadUrl: null,
  };
}

export class InvoiceGenerator {
  generate(input: GenerateInvoiceInput): CommerceInvoice {
    return buildInvoice(input);
  }

  preparePdf(invoice: CommerceInvoice): InvoicePdfPreparation {
    return prepareInvoicePdf(invoice);
  }
}

export function createInvoiceGenerator(): InvoiceGenerator {
  return new InvoiceGenerator();
}
