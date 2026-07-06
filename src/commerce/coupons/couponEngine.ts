import type { ApplyCouponInput, CommerceCoupon, CouponValidationResult } from '../types/coupon.types';
import { validateCouponApplication } from '../validators/couponValidator';
import { roundMoney } from '../utils/money';
import { DEFAULT_COUPONS } from './couponRegistry';

export class CouponEngine {
  constructor(private readonly coupons: CommerceCoupon[] = DEFAULT_COUPONS) {}

  findCoupon(code: string): CommerceCoupon | undefined {
    const normalized = code.trim().toUpperCase();
    return this.coupons.find((coupon) => coupon.code.toUpperCase() === normalized && coupon.isActive);
  }

  validate(input: ApplyCouponInput): CouponValidationResult {
    const formValidation = validateCouponApplication(input);
    if (!formValidation.valid) {
      return { valid: false, errors: formValidation.errors };
    }

    const coupon = this.findCoupon(input.code);
    if (!coupon) return { valid: false, errors: ['Invalid or expired coupon code.'] };

    const now = new Date();
    if (coupon.validFrom && new Date(coupon.validFrom) > now) {
      return { valid: false, errors: ['Coupon is not yet active.'] };
    }
    if (coupon.validUntil && new Date(coupon.validUntil) < now) {
      return { valid: false, errors: ['Coupon has expired.'] };
    }
    if (coupon.minOrderAmount && input.subtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        errors: [`Minimum order amount of ₹${coupon.minOrderAmount} required.`],
      };
    }
    if (coupon.membershipRequired && !input.hasActiveMembership) {
      return { valid: false, errors: ['This coupon requires an active membership.'] };
    }
    if (coupon.applicability === 'first_order' && !input.isFirstOrder) {
      return { valid: false, errors: ['This coupon is valid for first orders only.'] };
    }
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, errors: ['Coupon usage limit reached.'] };
    }

    const discountAmount = this.calculateDiscount(coupon, input.subtotal);
    return { valid: true, coupon, discountAmount };
  }

  calculateDiscount(coupon: CommerceCoupon, subtotal: number): number {
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = subtotal * (coupon.discountValue / 100);
    } else if (coupon.discountType === 'fixed') {
      discount = coupon.discountValue;
    }
    if (coupon.maxDiscountAmount) {
      discount = Math.min(discount, coupon.maxDiscountAmount);
    }
    return roundMoney(Math.min(discount, subtotal));
  }
}

export function createCouponEngine(coupons?: CommerceCoupon[]): CouponEngine {
  return new CouponEngine(coupons);
}
