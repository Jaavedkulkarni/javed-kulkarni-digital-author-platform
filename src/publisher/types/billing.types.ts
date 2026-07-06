import type { PaymentStatus } from './common';

export interface PublisherInvoice {
  id: string;
  jobId: string;
  publisherId: string;
  invoiceNumber: string;
  amount: number;
  gstAmount: number;
  isGstInvoice: boolean;
  storagePath: string | null;
  paymentStatus: PaymentStatus;
  paymentRequestId: string | null;
  uploadedAt: string;
}

export interface PaymentRequest {
  id: string;
  invoiceId: string;
  publisherId: string;
  amount: number;
  status: PaymentStatus;
  requestedAt: string;
  processedAt: string | null;
}
