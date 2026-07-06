import type { PublisherInvoice, PaymentRequest } from '../types/billing.types';
import { getProductionJobs } from './productionJobStore';
import { generateId } from '../utils/common';

const invoices = new Map<string, PublisherInvoice[]>();
const payments = new Map<string, PaymentRequest[]>();

function seedBilling(publisherId: string): void {
  if (invoices.has(publisherId)) return;
  const completedJobs = getProductionJobs(publisherId).filter((j) => j.status === 'completed');
  const now = new Date().toISOString();
  const invs: PublisherInvoice[] = completedJobs.map((j, i) => ({
    id: generateId('inv'),
    jobId: j.id,
    publisherId,
    invoiceNumber: `INV-2026-${100 + i}`,
    amount: j.quantity * 145,
    gstAmount: j.quantity * 145 * 0.18,
    isGstInvoice: true,
    storagePath: `invoices/${publisherId}/${j.id}.pdf`,
    paymentStatus: i === 0 ? 'paid' : 'pending',
    paymentRequestId: null,
    uploadedAt: now,
  }));
  invoices.set(publisherId, invs);
}

export function getInvoices(publisherId: string): PublisherInvoice[] {
  seedBilling(publisherId);
  return invoices.get(publisherId) ?? [];
}

export function getInvoiceById(publisherId: string, invoiceId: string): PublisherInvoice | null {
  return getInvoices(publisherId).find((i) => i.id === invoiceId) ?? null;
}

export function uploadInvoice(
  publisherId: string,
  input: Omit<PublisherInvoice, 'id' | 'publisherId' | 'paymentStatus' | 'paymentRequestId' | 'uploadedAt'>
): PublisherInvoice {
  const invoice: PublisherInvoice = {
    id: generateId('inv'),
    publisherId,
    ...input,
    paymentStatus: 'pending',
    paymentRequestId: null,
    uploadedAt: new Date().toISOString(),
  };
  invoices.set(publisherId, [...getInvoices(publisherId), invoice]);
  return invoice;
}

export function getPaymentRequests(publisherId: string): PaymentRequest[] {
  return payments.get(publisherId) ?? [];
}

export function createPaymentRequest(publisherId: string, invoiceId: string): PaymentRequest | null {
  const invoice = getInvoiceById(publisherId, invoiceId);
  if (!invoice) return null;
  const request: PaymentRequest = {
    id: generateId('pay'),
    invoiceId,
    publisherId,
    amount: invoice.amount + invoice.gstAmount,
    status: 'pending',
    requestedAt: new Date().toISOString(),
    processedAt: null,
  };
  payments.set(publisherId, [...getPaymentRequests(publisherId), request]);
  const updated = { ...invoice, paymentRequestId: request.id };
  invoices.set(
    publisherId,
    getInvoices(publisherId).map((i) => (i.id === invoiceId ? updated : i))
  );
  return request;
}

export function resetBillingStore(): void {
  invoices.clear();
  payments.clear();
}
