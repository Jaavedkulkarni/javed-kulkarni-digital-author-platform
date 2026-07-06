import {
  getInvoices,
  getInvoiceById,
  uploadInvoice as storeUpload,
  getPaymentRequests,
  createPaymentRequest as storePaymentRequest,
} from '../stores/billingStore';
import type { PublisherInvoice, PaymentRequest } from '../types/billing.types';
import type { PublisherOperationResult } from '../types/common';
import { validateInvoiceUpload } from '../validators/billingValidator';
import { assertPublisherOwnership } from '../utils/security';

export class BillingService {
  listInvoices(publisherId: string): PublisherInvoice[] {
    return getInvoices(publisherId);
  }

  getInvoice(publisherId: string, invoiceId: string): PublisherInvoice | null {
    const invoice = getInvoiceById(publisherId, invoiceId);
    if (!invoice || !assertPublisherOwnership(invoice.publisherId, publisherId)) return null;
    return invoice;
  }

  uploadInvoice(
    publisherId: string,
    input: {
      jobId: string;
      invoiceNumber: string;
      amount: number;
      gstAmount: number;
      isGstInvoice: boolean;
      storagePath?: string | null;
    }
  ): PublisherOperationResult<PublisherInvoice> {
    const validation = validateInvoiceUpload(input);
    if (!validation.valid) return { success: false, errors: validation.errors };
    const invoice = storeUpload(publisherId, {
      jobId: input.jobId,
      invoiceNumber: input.invoiceNumber,
      amount: input.amount,
      gstAmount: input.gstAmount,
      isGstInvoice: input.isGstInvoice,
      storagePath: input.storagePath ?? null,
    });
    return { success: true, data: invoice };
  }

  listPaymentRequests(publisherId: string): PaymentRequest[] {
    return getPaymentRequests(publisherId);
  }

  requestPayment(publisherId: string, invoiceId: string): PublisherOperationResult<PaymentRequest> {
    const invoice = this.getInvoice(publisherId, invoiceId);
    if (!invoice) return { success: false, errors: ['Invoice not found.'] };
    const request = storePaymentRequest(publisherId, invoiceId);
    if (!request) return { success: false, errors: ['Failed to create payment request.'] };
    return { success: true, data: request };
  }
}

export function createBillingService(): BillingService {
  return new BillingService();
}
