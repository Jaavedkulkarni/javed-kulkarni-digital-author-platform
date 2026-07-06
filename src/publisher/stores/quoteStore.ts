import type { PublisherQuote, SubmitQuoteInput, UpdateQuoteInput } from '../types/quote.types';
import { getRfqById, getRfqs } from './rfqStore';
import { addDays, generateId } from '../utils/common';

const quotes = new Map<string, PublisherQuote[]>();
const quoteSeeded = new Set<string>();

function seedQuotes(publisherId: string): void {
  if (quoteSeeded.has(publisherId)) return;
  const rfqList = getRfqs(publisherId);
  const now = new Date().toISOString();
  const statuses = ['pending', 'submitted', 'lost'] as const;
  const seededQuotes: PublisherQuote[] = rfqList.map((rfq, i) => {
    const status = statuses[i] ?? 'pending';
    const unitPrice = status === 'pending' ? 0 : 145 + i * 10;
    return {
      id: generateId('quote'),
      rfqId: rfq.id,
      rfqNumber: rfq.rfqNumber,
      publisherId,
      bookTitle: rfq.bookTitle,
      referenceAuthorName: rfq.referenceAuthorName,
      specifications: rfq.specifications,
      quantity: rfq.quantity,
      unitPrice,
      totalAmount: unitPrice * rfq.quantity,
      leadTimeDays: 14,
      validUntil: addDays(30),
      notes: status === 'submitted' ? 'Includes freight to destination.' : null,
      status,
      submittedAt: status !== 'pending' ? now : null,
      createdAt: now,
      updatedAt: now,
    };
  });
  quotes.set(publisherId, seededQuotes);
  quoteSeeded.add(publisherId);
}

export function getQuotes(publisherId: string): PublisherQuote[] {
  seedQuotes(publisherId);
  return quotes.get(publisherId) ?? [];
}

export function getQuoteById(publisherId: string, quoteId: string): PublisherQuote | null {
  return getQuotes(publisherId).find((q) => q.id === quoteId) ?? null;
}

export function getQuoteByRfqId(publisherId: string, rfqId: string): PublisherQuote | null {
  return getQuotes(publisherId).find((q) => q.rfqId === rfqId) ?? null;
}

export function submitQuote(input: SubmitQuoteInput): PublisherQuote | null {
  const rfq = getRfqById(input.publisherId, input.rfqId);
  if (!rfq) return null;
  const now = new Date().toISOString();
  const existing = getQuoteByRfqId(input.publisherId, input.rfqId);
  const totalAmount = input.unitPrice * rfq.quantity;
  if (existing) {
    const updated: PublisherQuote = {
      ...existing,
      unitPrice: input.unitPrice,
      totalAmount,
      leadTimeDays: input.leadTimeDays,
      notes: input.notes ?? null,
      status: 'submitted',
      submittedAt: now,
      updatedAt: now,
    };
    const list = getQuotes(input.publisherId).map((q) => (q.id === existing.id ? updated : q));
    quotes.set(input.publisherId, list);
    return updated;
  }
  const quote: PublisherQuote = {
    id: generateId('quote'),
    rfqId: rfq.id,
    rfqNumber: rfq.rfqNumber,
    publisherId: input.publisherId,
    bookTitle: rfq.bookTitle,
    referenceAuthorName: rfq.referenceAuthorName,
    specifications: rfq.specifications,
    quantity: rfq.quantity,
    unitPrice: input.unitPrice,
    totalAmount,
    leadTimeDays: input.leadTimeDays,
    validUntil: addDays(30),
    notes: input.notes ?? null,
    status: 'submitted',
    submittedAt: now,
    createdAt: now,
    updatedAt: now,
  };
  quotes.set(input.publisherId, [...getQuotes(input.publisherId), quote]);
  return quote;
}

export function updateQuote(input: UpdateQuoteInput): PublisherQuote | null {
  const existing = getQuoteById(input.publisherId, input.quoteId);
  if (!existing) return null;
  const rfq = getRfqById(input.publisherId, existing.rfqId);
  const quantity = rfq?.quantity ?? existing.quantity;
  const unitPrice = input.unitPrice ?? existing.unitPrice;
  const updated: PublisherQuote = {
    ...existing,
    unitPrice,
    totalAmount: unitPrice * quantity,
    leadTimeDays: input.leadTimeDays ?? existing.leadTimeDays,
    notes: input.notes !== undefined ? input.notes : existing.notes,
    updatedAt: new Date().toISOString(),
  };
  const list = getQuotes(input.publisherId).map((q) => (q.id === input.quoteId ? updated : q));
  quotes.set(input.publisherId, list);
  return updated;
}

export function withdrawQuote(publisherId: string, quoteId: string): PublisherQuote | null {
  const existing = getQuoteById(publisherId, quoteId);
  if (!existing) return null;
  const updated: PublisherQuote = {
    ...existing,
    status: 'pending',
    unitPrice: 0,
    totalAmount: 0,
    submittedAt: null,
    updatedAt: new Date().toISOString(),
  };
  const list = getQuotes(publisherId).map((q) => (q.id === quoteId ? updated : q));
  quotes.set(publisherId, list);
  return updated;
}

export function resetQuoteStore(): void {
  quotes.clear();
  quoteSeeded.clear();
}
