import type { WithdrawalRequest, RefundRequest, SettlementRecord, RevenueReportSnapshot } from '../../types/finance.types';

export function FinancePanel({
  withdrawals,
  refunds,
  pendingSettlements,
  completedSettlements,
  revenue,
  isLoading,
  onApproveWithdrawal,
  onProcessRefund,
}: {
  withdrawals?: WithdrawalRequest[];
  refunds?: RefundRequest[];
  pendingSettlements?: SettlementRecord[];
  completedSettlements?: SettlementRecord[];
  revenue?: RevenueReportSnapshot;
  isLoading?: boolean;
  onApproveWithdrawal?: (id: string) => void;
  onProcessRefund?: (id: string, approved: boolean) => void;
}) {
  if (isLoading) return <p className="text-sm text-gray-400">Loading finance...</p>;

  return (
    <div className="space-y-6">
      {revenue && (
        <div className="rounded-lg border border-navy-700 bg-navy-800/50 p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div><p className="text-xs text-gray-400">Gross</p><p className="text-white">₹{revenue.grossRevenue.toLocaleString('en-IN')}</p></div>
          <div><p className="text-xs text-gray-400">Commissions</p><p className="text-white">₹{revenue.commissions.toLocaleString('en-IN')}</p></div>
          <div><p className="text-xs text-gray-400">Refunds</p><p className="text-white">₹{revenue.refunds.toLocaleString('en-IN')}</p></div>
          <div><p className="text-xs text-gray-400">Net Ops</p><p className="text-white">₹{revenue.netOperations.toLocaleString('en-IN')}</p></div>
        </div>
      )}
      <section>
        <h3 className="text-sm font-medium text-white mb-2">Author Withdrawals</h3>
        {(withdrawals ?? []).map((w) => (
          <div key={w.id} className="flex justify-between items-center text-sm border border-navy-700 rounded px-3 py-2 mb-2">
            <span className="text-gray-300">{w.authorName} — ₹{w.amount.toLocaleString('en-IN')}</span>
            {w.status === 'pending' && onApproveWithdrawal && (
              <button type="button" onClick={() => onApproveWithdrawal(w.id)} className="text-xs text-gold-400">Approve</button>
            )}
          </div>
        ))}
      </section>
      <section>
        <h3 className="text-sm font-medium text-white mb-2">Refund Requests</h3>
        {(refunds ?? []).map((r) => (
          <div key={r.id} className="flex justify-between items-center text-sm border border-navy-700 rounded px-3 py-2 mb-2">
            <span className="text-gray-300">{r.orderNumber} — ₹{r.amount}</span>
            {r.status === 'pending' && onProcessRefund && (
              <div className="flex gap-2">
                <button type="button" onClick={() => onProcessRefund(r.id, true)} className="text-xs text-green-400">Approve</button>
                <button type="button" onClick={() => onProcessRefund(r.id, false)} className="text-xs text-red-400">Reject</button>
              </div>
            )}
          </div>
        ))}
      </section>
      <section>
        <h3 className="text-sm font-medium text-white mb-2">Settlements</h3>
        <p className="text-xs text-gray-500 mb-1">Pending: {(pendingSettlements ?? []).length} · Completed: {(completedSettlements ?? []).length}</p>
      </section>
    </div>
  );
}
