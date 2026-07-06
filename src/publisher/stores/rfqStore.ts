import type { RfqRequest } from '../types/rfq.types';
import { SAMPLE_SPECS, addDays, generateId } from '../utils/common';

const rfqs = new Map<string, RfqRequest[]>();
const seeded = new Set<string>();

function buildSeedRfqs(publisherId: string): RfqRequest[] {
  const now = new Date().toISOString();
  return [
    {
      id: generateId('rfq'),
      rfqNumber: 'RFQ-2026-001',
      publisherId,
      bookTitle: 'Echoes of the Monsoon',
      referenceAuthorName: 'Javed Kulkarni',
      specifications: SAMPLE_SPECS,
      quantity: 500,
      shippingLocation: 'Mumbai, Maharashtra',
      dueDate: addDays(30),
      specialInstructions: 'Include ISBN barcode on back cover.',
      receivedAt: now,
      quoteDeadline: addDays(7),
    },
    {
      id: generateId('rfq'),
      rfqNumber: 'RFQ-2026-002',
      publisherId,
      bookTitle: 'Digital Dharma',
      referenceAuthorName: 'Priya Sharma',
      specifications: { ...SAMPLE_SPECS, pageCount: 180, bindingType: 'Hardcover' },
      quantity: 200,
      shippingLocation: 'Bengaluru, Karnataka',
      dueDate: addDays(45),
      specialInstructions: null,
      receivedAt: now,
      quoteDeadline: addDays(5),
    },
    {
      id: generateId('rfq'),
      rfqNumber: 'RFQ-2026-003',
      publisherId,
      bookTitle: 'The Last Chapter',
      referenceAuthorName: 'Arun Mehta',
      specifications: { ...SAMPLE_SPECS, pageCount: 320 },
      quantity: 1000,
      shippingLocation: 'Delhi NCR',
      dueDate: addDays(60),
      specialInstructions: 'Rush order — AuthorOS priority.',
      receivedAt: addDays(-10),
      quoteDeadline: addDays(-2),
    },
  ];
}

function ensureSeeded(publisherId: string): void {
  if (seeded.has(publisherId)) return;
  rfqs.set(publisherId, buildSeedRfqs(publisherId));
  seeded.add(publisherId);
}

export function getRfqs(publisherId: string): RfqRequest[] {
  ensureSeeded(publisherId);
  return rfqs.get(publisherId) ?? [];
}

export function getRfqById(publisherId: string, rfqId: string): RfqRequest | null {
  return getRfqs(publisherId).find((r) => r.id === rfqId) ?? null;
}

export function resetRfqStore(): void {
  rfqs.clear();
  seeded.clear();
}
