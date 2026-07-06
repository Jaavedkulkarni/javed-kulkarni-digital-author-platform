import type { EarningsBalance } from '../types/earnings.types';
import type { PayoutRecord, WithdrawalRequest } from '../types/payouts.types';
import { getRoyalties } from './royaltyStore';

const payouts = new Map<string, PayoutRecord[]>();
const withdrawals = new Map<string, WithdrawalRequest[]>();

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getEarningsBalance(authorId: string): EarningsBalance {
  const royalties = getRoyalties(authorId);
  const pending = royalties.filter((r) => r.status === 'pending').reduce((s, r) => s + r.royaltyAmount, 0);
  const paid = royalties.filter((r) => r.status === 'paid').reduce((s, r) => s + r.royaltyAmount, 0);
  const withdrawn = getPayouts(authorId)
    .filter((p) => p.status === 'completed')
    .reduce((s, p) => s + p.amount, 0);

  return {
    authorId,
    availableBalance: Math.round(Math.max(0, paid - withdrawn) * 100) / 100,
    pendingBalance: Math.round(pending * 100) / 100,
    totalEarned: Math.round((pending + paid) * 100) / 100,
    currency: 'INR',
    updatedAt: new Date().toISOString(),
  };
}

export function getPayouts(authorId: string): PayoutRecord[] {
  return payouts.get(authorId) ?? [];
}

export function addPayout(payout: PayoutRecord): void {
  payouts.set(payout.authorId, [...getPayouts(payout.authorId), payout]);
}

export function getWithdrawals(authorId: string): WithdrawalRequest[] {
  return withdrawals.get(authorId) ?? [];
}

export function addWithdrawal(request: WithdrawalRequest): void {
  withdrawals.set(request.authorId, [...getWithdrawals(request.authorId), request]);
}

export function updateWithdrawal(authorId: string, id: string, patch: Partial<WithdrawalRequest>): WithdrawalRequest | null {
  const list = getWithdrawals(authorId).map((w) => (w.id === id ? { ...w, ...patch } : w));
  withdrawals.set(authorId, list);
  return list.find((w) => w.id === id) ?? null;
}

export function createWithdrawalRequest(
  authorId: string,
  amount: number,
  method: 'bank' | 'upi',
  destination: string
): WithdrawalRequest {
  return {
    id: createId('wdr'),
    authorId,
    amount,
    status: 'requested',
    method,
    destination,
    requestedAt: new Date().toISOString(),
    processedAt: null,
    rejectionReason: null,
  };
}

export function resetEarningsStore(): void {
  payouts.clear();
  withdrawals.clear();
}
