import type { SettlementStatus } from './common';

export interface WalletReviewItem {
  id: string;
  authorName: string;
  balance: number;
  status: 'pending' | 'approved' | 'flagged';
}

export interface WithdrawalRequest {
  id: string;
  authorName: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  requestedAt: string;
}

export interface RefundRequest {
  id: string;
  orderNumber: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'processed' | 'rejected';
}

export interface SettlementRecord {
  id: string;
  partyName: string;
  amount: number;
  type: 'author' | 'publisher' | 'service';
  status: SettlementStatus;
  dueDate: string;
}

export interface RevenueReportSnapshot {
  period: string;
  grossRevenue: number;
  commissions: number;
  refunds: number;
  netOperations: number;
}
