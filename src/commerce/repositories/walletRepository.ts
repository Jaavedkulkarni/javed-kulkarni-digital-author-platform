import type { WalletAccount, WalletCreditInput, WalletDebitInput, WalletTransaction } from '../types/wallet.types';
import { getWalletStore, WalletStore } from '../wallet/walletStore';

export class CommerceWalletRepository {
  constructor(private readonly store: WalletStore = getWalletStore()) {}

  getAccount(userId: string): WalletAccount {
    return this.store.getAccount(userId);
  }

  listTransactions(userId: string): WalletTransaction[] {
    return this.store.listTransactions(userId);
  }

  credit(input: WalletCreditInput) {
    return this.store.credit(input);
  }

  debit(input: WalletDebitInput) {
    return this.store.debit(input);
  }
}

export function createCommerceWalletRepository(store?: WalletStore): CommerceWalletRepository {
  return new CommerceWalletRepository(store);
}
