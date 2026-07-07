import type { CommerceCoupon } from '../types/coupon.types';
import { createCouponEngine, CouponEngine } from '../coupons/couponEngine';
import { DEFAULT_COUPONS } from '../coupons/couponRegistry';

export class CommerceCouponRepository {
  private readonly engine: CouponEngine;
  private readonly redemptionCounts = new Map<string, number>();

  constructor(coupons: CommerceCoupon[] = DEFAULT_COUPONS) {
    this.engine = createCouponEngine(coupons);
  }

  listActive(): CommerceCoupon[] {
    return DEFAULT_COUPONS.filter((coupon) => coupon.isActive);
  }

  findByCode(code: string): CommerceCoupon | undefined {
    return this.engine.findCoupon(code);
  }

  getEngine(): CouponEngine {
    return this.engine;
  }

  recordRedemption(code: string): void {
    const normalized = code.trim().toUpperCase();
    this.redemptionCounts.set(normalized, (this.redemptionCounts.get(normalized) ?? 0) + 1);
  }

  getRedemptionCount(code: string): number {
    return this.redemptionCounts.get(code.trim().toUpperCase()) ?? 0;
  }
}

export function createCommerceCouponRepository(coupons?: CommerceCoupon[]): CommerceCouponRepository {
  return new CommerceCouponRepository(coupons);
}
