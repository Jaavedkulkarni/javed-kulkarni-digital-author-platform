import type { WalletReviewItem, WithdrawalRequest, RefundRequest, SettlementRecord, RevenueReportSnapshot } from '../types/finance.types';
import { generateId } from '../utils/permissions';

const wallets: WalletReviewItem[] = [
  { id: generateId('w'), authorName: 'Javed Kulkarni', balance: 12500, status: 'pending' },
];
const withdrawals: WithdrawalRequest[] = [
  { id: generateId('wd'), authorName: 'Priya Sharma', amount: 5000, status: 'pending', requestedAt: new Date().toISOString() },
];
const refunds: RefundRequest[] = [
  { id: generateId('rf'), orderNumber: 'ORD-1001', amount: 499, reason: 'Duplicate purchase', status: 'pending' },
];
const settlements: SettlementRecord[] = [
  { id: generateId('st'), partyName: 'PrintCo Publishers', amount: 45000, type: 'publisher', status: 'pending', dueDate: new Date().toISOString() },
  { id: generateId('st'), partyName: 'Javed Kulkarni', amount: 8500, type: 'author', status: 'completed', dueDate: new Date().toISOString() },
];

export function getWalletReviews() { return wallets; }
export function getWithdrawals() { return withdrawals; }
export function getRefunds() { return refunds; }
export function getSettlements(status?: 'pending' | 'completed') {
  return status ? settlements.filter((s) => s.status === status) : settlements;
}
export function getRevenueSnapshot(): RevenueReportSnapshot {
  return { period: '2026-Q2', grossRevenue: 1250000, commissions: 187500, refunds: 12500, netOperations: 1050000 };
}

export function approveWithdrawal(id: string): WithdrawalRequest | null {
  const w = withdrawals.find((x) => x.id === id);
  if (!w) return null;
  w.status = 'approved';
  return w;
}

export function processRefund(id: string, approved: boolean): RefundRequest | null {
  const r = refunds.find((x) => x.id === id);
  if (!r) return null;
  r.status = approved ? 'approved' : 'rejected';
  return r;
}
