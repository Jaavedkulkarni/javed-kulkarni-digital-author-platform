import type { QuoteStatus } from './common';
import type { PrintSpecifications } from './rfq.types';

export interface PublisherQuote {
  id: string;
  rfqId: string;
  rfqNumber: string;
  publisherId: string;
  bookTitle: string;
  referenceAuthorName: string;
  specifications: PrintSpecifications;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  leadTimeDays: number;
  validUntil: string;
  notes: string | null;
  status: QuoteStatus;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitQuoteInput {
  rfqId: string;
  publisherId: string;
  unitPrice: number;
  leadTimeDays: number;
  notes?: string | null;
}

export interface UpdateQuoteInput {
  quoteId: string;
  publisherId: string;
  unitPrice?: number;
  leadTimeDays?: number;
  notes?: string | null;
}
