import {
  getWalletReviews,
  getWithdrawals,
  getRefunds,
  getSettlements,
  getRevenueSnapshot,
  approveWithdrawal,
  processRefund,
} from '../stores/financeStore';
import type { PlatformAdminOperationResult } from '../types/common';

export class FinanceService {
  getWalletReviews() { return getWalletReviews(); }
  getWithdrawals() { return getWithdrawals(); }
  getRefunds() { return getRefunds(); }
  getPendingSettlements() { return getSettlements('pending'); }
  getCompletedSettlements() { return getSettlements('completed'); }
  getRevenueSnapshot() { return getRevenueSnapshot(); }

  approveWithdrawal(id: string): PlatformAdminOperationResult {
    const w = approveWithdrawal(id);
    return w ? { success: true, data: w } : { success: false, errors: ['Withdrawal not found.'] };
  }

  processRefund(id: string, approved: boolean): PlatformAdminOperationResult {
    const r = processRefund(id, approved);
    return r ? { success: true, data: r } : { success: false, errors: ['Refund not found.'] };
  }
}

export function createFinanceService(): FinanceService {
  return new FinanceService();
}
