export type CouponDiscountType = 'percentage' | 'fixed' | 'free_shipping';

export type CouponApplicability = 'all' | 'books' | 'membership' | 'first_order';

export interface CommerceCoupon {
  code: string;
  label: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  applicability: CouponApplicability;
  membershipRequired?: boolean;
  validFrom?: string;
  validUntil?: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: CommerceCoupon;
  discountAmount?: number;
  errors?: string[];
}

export interface ApplyCouponInput {
  code: string;
  subtotal: number;
  userId: string;
  hasActiveMembership?: boolean;
  isFirstOrder?: boolean;
}
