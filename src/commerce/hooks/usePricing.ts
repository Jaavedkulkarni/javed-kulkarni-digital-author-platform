import { useMemo } from 'react';
import type { PriceBookInput } from '../types/pricing.types';
import { useCommerceServices } from './useCommerceServices';

export function usePricing() {
  const { pricing, discount } = useCommerceServices();

  return useMemo(
    () => ({
      calculatePricing: (input: PriceBookInput) => pricing.calculatePricing(input),
      calculateTax: (taxableAmount: number, buyerState?: string | null) =>
        pricing.calculateTax(taxableAmount, buyerState),
      calculateGst: (taxableAmount: number, buyerState?: string | null) =>
        pricing.calculateGst(taxableAmount, buyerState),
      getMembershipRate: discount.getMembershipRate.bind(discount),
      calculateLineDiscount: discount.calculateLineDiscount.bind(discount),
      calculateSubtotalDiscount: discount.calculateSubtotalDiscount.bind(discount),
    }),
    [pricing, discount]
  );
}
