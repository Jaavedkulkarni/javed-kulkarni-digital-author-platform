import type { CommerceCurrency } from '../types/common';
import type { WalletAccount, WalletTransaction, WalletCreditInput, WalletDebitInput } from '../types/wallet.types';
import { roundMoney } from '../utils/money';

function accountKey(userId: string): string {
  return userId;
}

let walletStoreInstance: WalletStore | null = null;

export class WalletStore {
  private accounts = new Map<string, WalletAccount>();
  private transactions = new Map<string, WalletTransaction[]>();

  getAccount(userId: string, currency: CommerceCurrency = 'INR'): WalletAccount {
    const key = accountKey(userId);
    const existing = this.accounts.get(key);
    if (existing) return existing;

    const account: WalletAccount = {
      userId,
      balance: 0,
      currency,
      heldAmount: 0,
      updatedAt: new Date().toISOString(),
    };
    this.accounts.set(key, account);
    return account;
  }

  listTransactions(userId: string): WalletTransaction[] {
    return [...(this.transactions.get(userId) ?? [])].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  credit(input: WalletCreditInput): { account: WalletAccount; transaction: WalletTransaction } {
    const currency = input.currency ?? 'INR';
    const account = this.getAccount(input.userId, currency);
    const transaction: WalletTransaction = {
      id: crypto.randomUUID(),
      userId: input.userId,
      type: 'credit',
      status: 'completed',
      amount: roundMoney(input.amount, currency),
      currency,
      referenceType: input.referenceType,
      referenceId: input.referenceId ?? null,
      description: input.description,
      createdAt: new Date().toISOString(),
    };

    account.balance = roundMoney(account.balance + transaction.amount, currency);
    account.updatedAt = transaction.createdAt;
    this.accounts.set(accountKey(input.userId), account);
    this.appendTransaction(input.userId, transaction);
    return { account, transaction };
  }

  debit(input: WalletDebitInput): { account: WalletAccount; transaction: WalletTransaction } | { error: string } {
    const currency = input.currency ?? 'INR';
    const account = this.getAccount(input.userId, currency);
    const amount = roundMoney(input.amount, currency);

    if (account.balance < amount) {
      return { error: 'Insufficient wallet balance.' };
    }

    const transaction: WalletTransaction = {
      id: crypto.randomUUID(),
      userId: input.userId,
      type: 'debit',
      status: 'completed',
      amount,
      currency,
      referenceType: input.referenceType,
      referenceId: input.referenceId ?? null,
      description: input.description,
      createdAt: new Date().toISOString(),
    };

    account.balance = roundMoney(account.balance - amount, currency);
    account.updatedAt = transaction.createdAt;
    this.accounts.set(accountKey(input.userId), account);
    this.appendTransaction(input.userId, transaction);
    return { account, transaction };
  }

  private appendTransaction(userId: string, transaction: WalletTransaction): void {
    const list = this.transactions.get(userId) ?? [];
    list.push(transaction);
    this.transactions.set(userId, list);
  }
}

export function getWalletStore(): WalletStore {
  if (!walletStoreInstance) walletStoreInstance = new WalletStore();
  return walletStoreInstance;
}

export function resetWalletStore(): void {
  walletStoreInstance = null;
}
