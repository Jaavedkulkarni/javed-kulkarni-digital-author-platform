import type { CreateWithdrawalInput } from '../types/payouts.types';
import { mergeResults, validateRequired } from './common';

export function validateWithdrawalRequest(input: CreateWithdrawalInput, availableBalance: number) {
  const results = [
    validateRequired(input.authorId, 'Author'),
    validateRequired(input.destination, 'Destination'),
  ];
  if (input.amount <= 0) results.push({ valid: false, errors: ['Amount must be greater than zero.'] });
  if (input.amount > availableBalance) {
    results.push({ valid: false, errors: ['Amount exceeds available balance.'] });
  }
  return mergeResults(...results);
}
