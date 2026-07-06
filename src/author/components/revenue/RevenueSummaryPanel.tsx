import type { RoyaltySummary } from '../types/revenue.types';

interface RevenueSummaryPanelProps {
  summary: RoyaltySummary | null | undefined;
}

export function RevenueSummaryPanel({ summary }: RevenueSummaryPanelProps) {
  if (!summary) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gold-400">Revenue</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded border border-navy-700 p-4">
          <p className="text-xs text-gray-400">Pending</p>
          <p className="text-lg font-semibold text-amber-400">₹{summary.pending.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded border border-navy-700 p-4">
          <p className="text-xs text-gray-400">Paid</p>
          <p className="text-lg font-semibold text-green-400">₹{summary.paid.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded border border-navy-700 p-4">
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-lg font-semibold text-white">₹{summary.total.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
}
