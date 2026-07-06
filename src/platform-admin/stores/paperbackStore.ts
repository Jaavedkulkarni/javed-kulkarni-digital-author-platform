import type { PaperbackRequest, RfqRecord, QuoteComparison, ProductionTracking } from '../types/paperback.types';
import { generateId } from '../utils/permissions';

const requests: PaperbackRequest[] = [
  { id: generateId('pbr'), requestNumber: 'PBR-001', bookTitle: 'Echoes of the Monsoon', authorName: 'Javed Kulkarni', quantity: 500, status: 'pending', createdAt: new Date().toISOString() },
];
const rfqs: RfqRecord[] = [];
const quotes: QuoteComparison[] = [];
const production: ProductionTracking[] = [
  { id: generateId('pt'), jobNumber: 'PJ-101', bookTitle: 'Whispers in Ink', publisherName: 'PrintCo', status: 'printing', proofStatus: 'approved', dispatchStatus: 'pending', deliveryStatus: 'pending' },
];

export function getPaperbackRequests() { return requests; }
export function getRfqs() { return rfqs; }
export function getQuotes() { return quotes; }
export function getProductionTracking() { return production; }

export function createRfq(requestId: string): RfqRecord | null {
  const req = requests.find((r) => r.id === requestId);
  if (!req) return null;
  const rfq: RfqRecord = {
    id: generateId('rfq'),
    rfqNumber: `RFQ-${rfqs.length + 1}`,
    paperbackRequestId: requestId,
    bookTitle: req.bookTitle,
    publisherCount: 3,
    status: 'open',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
  };
  rfqs.push(rfq);
  req.status = 'rfq_sent';
  return rfq;
}

export function assignPublisher(requestId: string, publisherName: string): PaperbackRequest | null {
  const req = requests.find((r) => r.id === requestId);
  if (!req) return null;
  req.status = 'assigned';
  production.push({
    id: generateId('pt'),
    jobNumber: `PJ-${production.length + 100}`,
    bookTitle: req.bookTitle,
    publisherName,
    status: 'prepress',
    proofStatus: 'awaiting',
    dispatchStatus: 'pending',
    deliveryStatus: 'pending',
  });
  return req;
}
