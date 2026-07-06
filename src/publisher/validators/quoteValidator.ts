import type { SubmitQuoteInput, UpdateQuoteInput } from '../types/quote.types';
import type { RfqRequest } from '../types/rfq.types';
import { invalidResult, validResult, validatePositiveNumber } from './common';

export function validateSubmitQuote(
  input: SubmitQuoteInput,
  rfq: RfqRequest | null
): { valid: boolean; errors: string[] } {
  if (!rfq) return invalidResult(['RFQ not found.']);
  if (rfq.publisherId !== input.publisherId) {
    return invalidResult(['You can only quote on RFQs assigned to your company.']);
  }
  if (new Date(rfq.quoteDeadline) < new Date()) {
    return invalidResult(['Quote deadline has passed.']);
  }
  const priceCheck = validatePositiveNumber(input.unitPrice, 'Unit price');
  if (!priceCheck.valid) return priceCheck;
  const leadCheck = validatePositiveNumber(input.leadTimeDays, 'Lead time');
  if (!leadCheck.valid) return leadCheck;
  return validResult();
}

export function validateUpdateQuote(
  input: UpdateQuoteInput,
  rfq: RfqRequest | null,
  quoteStatus: string
): { valid: boolean; errors: string[] } {
  if (!rfq) return invalidResult(['RFQ not found.']);
  if (new Date(rfq.quoteDeadline) < new Date()) {
    return invalidResult(['Quote deadline has passed. Cannot edit.']);
  }
  if (quoteStatus !== 'pending' && quoteStatus !== 'submitted') {
    return invalidResult(['Quote can no longer be edited.']);
  }
  if (input.unitPrice !== undefined) {
    const priceCheck = validatePositiveNumber(input.unitPrice, 'Unit price');
    if (!priceCheck.valid) return priceCheck;
  }
  if (input.leadTimeDays !== undefined) {
    const leadCheck = validatePositiveNumber(input.leadTimeDays, 'Lead time');
    if (!leadCheck.valid) return leadCheck;
  }
  return validResult();
}

export function validateWithdrawQuote(
  quoteStatus: string,
  rfq: RfqRequest | null
): { valid: boolean; errors: string[] } {
  if (!rfq) return invalidResult(['RFQ not found.']);
  if (new Date(rfq.quoteDeadline) < new Date()) {
    return invalidResult(['Quote deadline has passed.']);
  }
  if (quoteStatus !== 'submitted' && quoteStatus !== 'pending') {
    return invalidResult(['Only pending or submitted quotes can be withdrawn.']);
  }
  return validResult();
}
