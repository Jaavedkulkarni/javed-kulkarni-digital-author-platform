import {
  getQuotes,
  getQuoteById,
  submitQuote as storeSubmit,
  updateQuote as storeUpdate,
  withdrawQuote as storeWithdraw,
} from '../stores/quoteStore';
import { getRfqById } from '../stores/rfqStore';
import type { PublisherQuote, SubmitQuoteInput, UpdateQuoteInput } from '../types/quote.types';
import type { PublisherOperationResult } from '../types/common';
import { validateSubmitQuote, validateUpdateQuote, validateWithdrawQuote } from '../validators/quoteValidator';
import { assertPublisherOwnership } from '../utils/security';

export class QuoteService {
  list(publisherId: string): PublisherQuote[] {
    return getQuotes(publisherId);
  }

  getById(publisherId: string, quoteId: string): PublisherQuote | null {
    const quote = getQuoteById(publisherId, quoteId);
    if (!quote || !assertPublisherOwnership(quote.publisherId, publisherId)) return null;
    return quote;
  }

  listByStatus(publisherId: string, status: PublisherQuote['status']): PublisherQuote[] {
    return getQuotes(publisherId).filter((q) => q.status === status);
  }

  submit(input: SubmitQuoteInput): PublisherOperationResult<PublisherQuote> {
    const rfq = getRfqById(input.publisherId, input.rfqId);
    const validation = validateSubmitQuote(input, rfq);
    if (!validation.valid) return { success: false, errors: validation.errors };
    const quote = storeSubmit(input);
    if (!quote) return { success: false, errors: ['Failed to submit quote.'] };
    return { success: true, data: quote };
  }

  update(input: UpdateQuoteInput): PublisherOperationResult<PublisherQuote> {
    const existing = getQuoteById(input.publisherId, input.quoteId);
    if (!existing) return { success: false, errors: ['Quote not found.'] };
    const rfq = getRfqById(input.publisherId, existing.rfqId);
    const validation = validateUpdateQuote(input, rfq, existing.status);
    if (!validation.valid) return { success: false, errors: validation.errors };
    const quote = storeUpdate(input);
    if (!quote) return { success: false, errors: ['Failed to update quote.'] };
    return { success: true, data: quote };
  }

  withdraw(publisherId: string, quoteId: string): PublisherOperationResult<PublisherQuote> {
    const existing = getQuoteById(publisherId, quoteId);
    if (!existing) return { success: false, errors: ['Quote not found.'] };
    const rfq = getRfqById(publisherId, existing.rfqId);
    const validation = validateWithdrawQuote(existing.status, rfq);
    if (!validation.valid) return { success: false, errors: validation.errors };
    const quote = storeWithdraw(publisherId, quoteId);
    if (!quote) return { success: false, errors: ['Failed to withdraw quote.'] };
    return { success: true, data: quote };
  }
}

export function createQuoteService(): QuoteService {
  return new QuoteService();
}
