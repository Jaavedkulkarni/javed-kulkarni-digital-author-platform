import type { CommerceCurrency } from './common';
import type { CartLineItem } from './cart.types';

export interface LinePricing {
  lineItemId: string;
  bookId: string;
  basePrice: number;
  salePrice: number;
  effectivePrice: number;
  membershipDiscount: number;
  couponDiscount: number;
  lineSubtotal: number;
  pricingModel: 'free' | 'paid' | 'membership';
}

export interface PricingBreakdown {
  lines: LinePricing[];
  subtotal: number;
  membershipDiscountTotal: number;
  couponDiscountTotal: number;
  discountTotal: number;
  taxableAmount: number;
  currency: CommerceCurrency;
}

export interface PriceBookInput {
  items: CartLineItem[];
  currency: CommerceCurrency;
  membershipTier?: 'free' | 'basic' | 'premium' | 'lifetime' | null;
  couponCode?: string | null;
  regionCode?: string;
}
