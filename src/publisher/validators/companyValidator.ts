import type { UpdateCompanyProfileInput } from '../types/company.types';
import { invalidResult, validResult, validateRequired } from './common';

export function validateCompanyProfileUpdate(
  input: UpdateCompanyProfileInput
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (input.gstin && input.gstin.length !== 15) {
    errors.push('GSTIN must be 15 characters.');
  }
  if (input.pan && input.pan.length !== 10) {
    errors.push('PAN must be 10 characters.');
  }
  if (input.bank) {
    const bank = input.bank;
    if (!bank.accountHolderName?.trim()) errors.push('Account holder name is required.');
    if (!bank.accountNumber?.trim()) errors.push('Account number is required.');
    if (!bank.ifscCode?.trim()) errors.push('IFSC code is required.');
    if (!bank.bankName?.trim()) errors.push('Bank name is required.');
  }
  if (input.contactEmail) {
    const emailCheck = validateRequired(input.contactEmail, 'Contact email');
    if (!emailCheck.valid) errors.push(...emailCheck.errors);
  }
  return errors.length ? invalidResult(errors) : validResult();
}
