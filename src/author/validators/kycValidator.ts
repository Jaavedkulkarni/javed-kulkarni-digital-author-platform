import type { UpdateKycProfileInput } from '../types/kyc.types';
import { mergeResults, validResult, invalidResult } from './common';

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export function validateKycProfile(input: UpdateKycProfileInput) {
  const results = [];
  if (input.pan && !PAN_REGEX.test(input.pan.toUpperCase())) {
    results.push(invalidResult(['Invalid PAN format.']));
  }
  if (input.gstin && !GSTIN_REGEX.test(input.gstin.toUpperCase())) {
    results.push(invalidResult(['Invalid GSTIN format.']));
  }
  if (input.bank) {
    if (!input.bank.accountNumber?.trim()) results.push(invalidResult(['Bank account number is required.']));
    if (!input.bank.ifscCode?.trim()) results.push(invalidResult(['IFSC code is required.']));
  }
  if (input.upi?.upiId && !input.upi.upiId.includes('@')) {
    results.push(invalidResult(['Invalid UPI ID format.']));
  }
  if (results.length === 0) return validResult();
  return mergeResults(...results);
}
