import type { EarningsBalance } from '../types/earnings.types';
import type { CreateWithdrawalInput, PayoutRecord, WithdrawalRequest } from '../types/payouts.types';
import {
  getEarningsBalance,
  getPayouts,
  getWithdrawals,
  addWithdrawal,
  createWithdrawalRequest,
} from '../stores/earningsStore';
import { validateWithdrawalRequest } from '../validators/payoutValidator';

export class EarningsPayoutsService {
  getBalance(authorId: string): EarningsBalance {
    return getEarningsBalance(authorId);
  }

  getPayoutHistory(authorId: string): PayoutRecord[] {
    return getPayouts(authorId);
  }

  getWithdrawalRequests(authorId: string): WithdrawalRequest[] {
    return getWithdrawals(authorId);
  }

  requestWithdrawal(input: CreateWithdrawalInput): { request?: WithdrawalRequest; errors?: string[] } {
    const balance = getEarningsBalance(input.authorId);
    const validation = validateWithdrawalRequest(input, balance.availableBalance);
    if (!validation.valid) return { errors: validation.errors };

    const request = createWithdrawalRequest(
      input.authorId,
      input.amount,
      input.method,
      input.destination
    );
    addWithdrawal(request);
    return { request };
  }
}

export function createEarningsPayoutsService(): EarningsPayoutsService {
  return new EarningsPayoutsService();
}
