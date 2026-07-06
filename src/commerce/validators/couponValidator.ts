import type { ApplyCouponInput } from '../types/coupon.types';

export function validateCouponApplication(input: ApplyCouponInput) {
  const errors: string[] = [];
  if (!input.code?.trim()) errors.push('Coupon code is required.');
  if (input.subtotal < 0) errors.push('Subtotal cannot be negative.');
  return { valid: errors.length === 0, errors };
}
