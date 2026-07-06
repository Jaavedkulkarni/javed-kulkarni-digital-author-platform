import type { CommerceCoupon } from '../types/coupon.types';

export const DEFAULT_COUPONS: CommerceCoupon[] = [
  {
    code: 'WELCOME10',
    label: 'Welcome 10% Off',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 99,
    maxDiscountAmount: 200,
    applicability: 'first_order',
    validFrom: '2026-01-01',
    validUntil: '2027-12-31',
    usageLimit: 10000,
    usageCount: 0,
    isActive: true,
  },
  {
    code: 'MEMBER15',
    label: 'Member 15% Off',
    discountType: 'percentage',
    discountValue: 15,
    applicability: 'books',
    membershipRequired: true,
    usageCount: 0,
    isActive: true,
  },
  {
    code: 'FLAT50',
    label: 'Flat ₹50 Off',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 199,
    applicability: 'all',
    usageCount: 0,
    isActive: true,
  },
];
