import { useMutation, useQuery } from '@tanstack/react-query';
import { commerceQueryKeys } from '../query/queryKeys';
import type { ApplyCouponInput } from '../types/coupon.types';
import { useCommerceServices } from './useCommerceServices';

export function useCoupons() {
  const { coupons } = useCommerceServices();

  return useQuery({
    queryKey: commerceQueryKeys.coupons(),
    queryFn: () => coupons.listActive(),
  });
}

export function useCouponValidation() {
  const { coupons } = useCommerceServices();

  return useMutation({
    mutationFn: (input: ApplyCouponInput) => Promise.resolve(coupons.validate(input)),
  });
}

export function useApplyCoupon() {
  const { coupons } = useCommerceServices();

  return useMutation({
    mutationFn: (input: ApplyCouponInput) => Promise.resolve(coupons.apply(input)),
  });
}
