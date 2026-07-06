import type { PriceBookInput, PricingBreakdown, LinePricing } from '../types/pricing.types';
import type { MembershipTier } from '../../types/database';
import { DEFAULT_CURRENCY } from '../constants/commerce.constants';
import { roundMoney, sumMoney } from '../utils/money';
import { createCouponEngine } from '../coupons/couponEngine';
import { calculateLineMembershipDiscount } from './discountEngine';

export class PricingEngine {
  constructor(private readonly couponEngine = createCouponEngine()) {}

  price(input: PriceBookInput): PricingBreakdown {
    const currency = input.currency ?? DEFAULT_CURRENCY;
    const tier = (input.membershipTier ?? 'free') as MembershipTier;

    const lines: LinePricing[] = input.items.map((item) => {
      const basePrice = item.unitPrice;
      const salePrice = item.pricingModel === 'free' ? 0 : basePrice;
      const lineSubtotal = roundMoney(salePrice * item.quantity);
      const membershipDiscount = calculateLineMembershipDiscount(lineSubtotal, tier);

      return {
        lineItemId: item.id,
        bookId: item.bookId,
        basePrice,
        salePrice,
        effectivePrice: salePrice,
        membershipDiscount,
        couponDiscount: 0,
        lineSubtotal,
        pricingModel: item.pricingModel,
      };
    });

    const subtotal = roundMoney(sumMoney(lines.map((line) => line.lineSubtotal)));
    const membershipDiscountTotal = roundMoney(
      sumMoney(lines.map((line) => line.membershipDiscount))
    );

    let couponDiscountTotal = 0;
    if (input.couponCode) {
      const couponResult = this.couponEngine.validate({
        code: input.couponCode,
        subtotal: subtotal - membershipDiscountTotal,
        userId: 'pricing-preview',
        hasActiveMembership: tier !== 'free',
      });
      if (couponResult.valid && couponResult.discountAmount) {
        couponDiscountTotal = couponResult.discountAmount;
      }
    }

    const discountTotal = roundMoney(membershipDiscountTotal + couponDiscountTotal);
    const taxableAmount = roundMoney(Math.max(0, subtotal - discountTotal));

    return {
      lines,
      subtotal,
      membershipDiscountTotal,
      couponDiscountTotal,
      discountTotal,
      taxableAmount,
      currency,
    };
  }
}

export function createPricingEngine(): PricingEngine {
  return new PricingEngine();
}
