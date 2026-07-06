import { invalidResult, validResult, validatePositiveNumber, validateRequired } from './common';

export function validateInvoiceUpload(input: {
  invoiceNumber: string;
  amount: number;
  gstAmount: number;
}): { valid: boolean; errors: string[] } {
  const numCheck = validateRequired(input.invoiceNumber, 'Invoice number');
  if (!numCheck.valid) return numCheck;
  const amountCheck = validatePositiveNumber(input.amount, 'Amount');
  if (!amountCheck.valid) return amountCheck;
  if (input.gstAmount < 0) return invalidResult(['GST amount cannot be negative.']);
  return validResult();
}
