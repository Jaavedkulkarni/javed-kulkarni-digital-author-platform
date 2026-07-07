import type { CommerceWalletRepository } from '../repositories/walletRepository';
import type { WalletAccount, WalletCreditInput, WalletDebitInput, WalletTransaction } from '../types/wallet.types';
import type { CommerceOperationResult } from '../types/common';

export class WalletService {
  constructor(private readonly repo: CommerceWalletRepository) {}

  getAccount(userId: string): WalletAccount {
    return this.repo.getAccount(userId);
  }

  listTransactions(userId: string): WalletTransaction[] {
    return this.repo.listTransactions(userId);
  }

  credit(input: WalletCreditInput): CommerceOperationResult<{ account: WalletAccount; transaction: WalletTransaction }> {
    const result = this.repo.credit(input);
    return { success: true, data: result };
  }

  debit(input: WalletDebitInput): CommerceOperationResult<{ account: WalletAccount; transaction: WalletTransaction }> {
    const result = this.repo.debit(input);
    if ('error' in result) {
      return { success: false, errors: [result.error] };
    }
    return { success: true, data: result };
  }
}

export function createWalletService(repo: CommerceWalletRepository): WalletService {
  return new WalletService(repo);
}
