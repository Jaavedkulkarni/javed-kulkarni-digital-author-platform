import type { PayoutStatus, WithdrawalStatus } from './common';

export interface EarningsBalance {
  authorId: string;
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
  currency: string;
  updatedAt: string;
}

export interface PayoutRecord {
  id: string;
  authorId: string;
  amount: number;
  status: PayoutStatus;
  method: 'bank' | 'upi';
  reference: string | null;
  initiatedAt: string;
  completedAt: string | null;
}

export interface WithdrawalRequest {
  id: string;
  authorId: string;
  amount: number;
  status: WithdrawalStatus;
  method: 'bank' | 'upi';
  destination: string;
  requestedAt: string;
  processedAt: string | null;
  rejectionReason: string | null;
}

export interface CreateWithdrawalInput {
  authorId: string;
  amount: number;
  method: 'bank' | 'upi';
  destination: string;
}
