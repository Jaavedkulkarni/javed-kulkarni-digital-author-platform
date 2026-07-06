import type { MembershipTier } from '../../types/database';
import { MEMBERSHIP_DISCOUNT_RATES } from '../constants/commerce.constants';
import type { CartLineItem } from '../types/cart.types';
import { roundMoney } from '../utils/money';

export function getMembershipDiscountRate(tier: MembershipTier | null | undefined): number {
  if (!tier || tier === 'free') return 0;
  return MEMBERSHIP_DISCOUNT_RATES[tier] ?? 0;
}

export function calculateMembershipDiscount(
  item: CartLineItem,
  tier: MembershipTier | null | undefined
): number {
  if (item.pricingModel === 'free') return 0;
  const rate = getMembershipDiscountRate(tier);
  return roundMoney(item.unitPrice * item.quantity * rate);
}

export function calculateLineMembershipDiscount(
  lineSubtotal: number,
  tier: MembershipTier | null | undefined
): number {
  const rate = getMembershipDiscountRate(tier);
  return roundMoney(lineSubtotal * rate);
}
