import type { PublisherInvoice } from '../../types/billing.types';

interface BillingPanelProps {
  invoices: PublisherInvoice[];
  isLoading?: boolean;
}

const PAYMENT_LABELS: Record<string, string> = {
  pending: 'Pending',
  approved: 'Approved',
  paid: 'Paid',
};

export function BillingPanel({ invoices, isLoading }: BillingPanelProps) {
  if (isLoading) return <div className="text-sm text-gray-400">Loading billing...</div>;

  if (invoices.length === 0) {
    return <p className="text-sm text-gray-400">No invoices uploaded.</p>;
  }

  return (
    <div className="space-y-2">
      {invoices.map((inv) => (
        <div
          key={inv.id}
          className="flex justify-between items-center rounded border border-navy-700 bg-navy-800/30 px-3 py-2"
        >
          <div>
            <p className="text-sm text-white">{inv.invoiceNumber}</p>
            <p className="text-xs text-gray-400">
              ₹{(inv.amount + inv.gstAmount).toLocaleString('en-IN')}
              {inv.isGstInvoice ? ' (GST)' : ''}
            </p>
          </div>
          <span className="text-xs text-gray-300">
            {PAYMENT_LABELS[inv.paymentStatus] ?? inv.paymentStatus}
          </span>
        </div>
      ))}
    </div>
  );
}
