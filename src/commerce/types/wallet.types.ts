import type { CommerceCurrency } from './common';

export type WalletTransactionType = 'credit' | 'debit' | 'hold' | 'release' | 'refund';

export type WalletTransactionStatus = 'pending' | 'completed' | 'failed' | 'reversed';

export interface WalletAccount {
  userId: string;
  balance: number;
  currency: CommerceCurrency;
  heldAmount: number;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: WalletTransactionType;
  status: WalletTransactionStatus;
  amount: number;
  currency: CommerceCurrency;
  referenceType: 'order' | 'refund' | 'membership' | 'adjustment' | 'payout';
  referenceId: string | null;
  description: string;
  createdAt: string;
}

export interface WalletCreditInput {
  userId: string;
  amount: number;
  currency?: CommerceCurrency;
  referenceType: WalletTransaction['referenceType'];
  referenceId?: string;
  description: string;
}

export interface WalletDebitInput {
  userId: string;
  amount: number;
  currency?: CommerceCurrency;
  referenceType: WalletTransaction['referenceType'];
  referenceId?: string;
  description: string;
}
