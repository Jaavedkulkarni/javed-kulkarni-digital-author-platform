import type { RfqRequest } from '../../types/rfq.types';
import { QUOTE_STATUS_LABELS } from '../../constants';

interface RfqListPanelProps {
  rfqs: RfqRequest[];
  isLoading?: boolean;
}

export function RfqListPanel({ rfqs, isLoading }: RfqListPanelProps) {
  if (isLoading) return <div className="text-sm text-gray-400">Loading RFQs...</div>;

  if (rfqs.length === 0) {
    return <p className="text-sm text-gray-400">No quotation requests from AuthorOS.</p>;
  }

  return (
    <div className="space-y-3">
      {rfqs.map((rfq) => (
        <div key={rfq.id} className="rounded-lg border border-navy-700 bg-navy-800/50 p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-white">{rfq.rfqNumber}</p>
              <p className="text-xs text-gray-400 mt-1">{rfq.bookTitle}</p>
              <p className="text-xs text-gray-500">Ref: {rfq.referenceAuthorName}</p>
            </div>
            <span className="text-xs text-amber-400">Due {rfq.quoteDeadline.slice(0, 10)}</span>
          </div>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-400">
            <span>Qty: {rfq.quantity}</span>
            <span>{rfq.specifications.trimSize}</span>
            <span>{rfq.specifications.pageCount} pages</span>
            <span>{rfq.specifications.bindingType}</span>
          </div>
          {rfq.specialInstructions && (
            <p className="mt-2 text-xs text-gray-500">{rfq.specialInstructions}</p>
          )}
        </div>
      ))}
    </div>
  );
}

interface QuoteListPanelProps {
  quotes: Array<{
    id: string;
    rfqNumber: string;
    bookTitle: string;
    status: string;
    totalAmount: number;
  }>;
  isLoading?: boolean;
}

export function QuoteListPanel({ quotes, isLoading }: QuoteListPanelProps) {
  if (isLoading) return <div className="text-sm text-gray-400">Loading quotes...</div>;

  return (
    <div className="space-y-2">
      {quotes.map((q) => (
        <div
          key={q.id}
          className="flex justify-between items-center rounded border border-navy-700 bg-navy-800/30 px-3 py-2"
        >
          <div>
            <p className="text-sm text-white">{q.rfqNumber} — {q.bookTitle}</p>
            <p className="text-xs text-gray-400">
              {QUOTE_STATUS_LABELS[q.status] ?? q.status}
              {q.totalAmount > 0 ? ` · ₹${q.totalAmount.toLocaleString('en-IN')}` : ''}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
