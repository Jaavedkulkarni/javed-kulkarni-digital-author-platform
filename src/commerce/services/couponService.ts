import type { CommerceCouponRepository } from '../repositories/couponRepository';
import type { ApplyCouponInput, CommerceCoupon, CouponValidationResult } from '../types/coupon.types';
import type { CommerceOperationResult } from '../types/common';

export class CouponService {
  constructor(private readonly repo: CommerceCouponRepository) {}

  listActive(): CommerceCoupon[] {
    return this.repo.listActive();
  }

  findByCode(code: string): CommerceCoupon | undefined {
    return this.repo.findByCode(code);
  }

  validate(input: ApplyCouponInput): CouponValidationResult {
    return this.repo.getEngine().validate(input);
  }

  apply(input: ApplyCouponInput): CommerceOperationResult<{ coupon: CommerceCoupon; discountAmount: number }> {
    const result = this.validate(input);
    if (!result.valid || !result.coupon || result.discountAmount === undefined) {
      return { success: false, errors: result.errors ?? ['Coupon could not be applied.'] };
    }
    this.repo.recordRedemption(result.coupon.code);
    return {
      success: true,
      data: { coupon: result.coupon, discountAmount: result.discountAmount },
    };
  }
}

export function createCouponService(repo: CommerceCouponRepository): CouponService {
  return new CouponService(repo);
}
