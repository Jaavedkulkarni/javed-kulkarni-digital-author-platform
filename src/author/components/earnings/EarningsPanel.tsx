import type { EarningsBalance } from '../../types/earnings.types';
import type { PayoutRecord, WithdrawalRequest } from '../../types/payouts.types';

interface EarningsPanelProps {
  balance: EarningsBalance | null | undefined;
  payouts: PayoutRecord[];
  withdrawals: WithdrawalRequest[];
}

export function EarningsPanel({ balance, payouts, withdrawals }: EarningsPanelProps) {
  if (!balance) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gold-400">Earnings & Payouts</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded border border-navy-700 p-4">
          <p className="text-xs text-gray-400">Available</p>
          <p className="text-lg font-semibold text-green-400">
            ₹{balance.availableBalance.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="rounded border border-navy-700 p-4">
          <p className="text-xs text-gray-400">Pending</p>
          <p className="text-lg font-semibold text-amber-400">
            ₹{balance.pendingBalance.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="rounded border border-navy-700 p-4">
          <p className="text-xs text-gray-400">Total Earned</p>
          <p className="text-lg font-semibold text-white">
            ₹{balance.totalEarned.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs text-gray-400 mb-2">Payout History ({payouts.length})</p>
          {payouts.length === 0 && <p className="text-gray-500 text-xs">No payouts yet.</p>}
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-2">Withdrawal Requests ({withdrawals.length})</p>
          {withdrawals.map((w) => (
            <p key={w.id} className="text-gray-300 text-xs">
              ₹{w.amount} — {w.status}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
