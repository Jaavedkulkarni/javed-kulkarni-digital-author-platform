import type { MembershipTier } from '../../types/database';
import type { CartLineItem } from '../types/cart.types';
import {
  calculateLineMembershipDiscount,
  calculateMembershipDiscount,
  getMembershipDiscountRate,
} from '../pricing/discountEngine';

export class DiscountService {
  getMembershipRate(tier: MembershipTier | null | undefined): number {
    return getMembershipDiscountRate(tier);
  }

  calculateLineDiscount(item: CartLineItem, tier: MembershipTier | null | undefined): number {
    return calculateMembershipDiscount(item, tier);
  }

  calculateSubtotalDiscount(subtotal: number, tier: MembershipTier | null | undefined): number {
    return calculateLineMembershipDiscount(subtotal, tier);
  }
}

export function createDiscountService(): DiscountService {
  return new DiscountService();
}
