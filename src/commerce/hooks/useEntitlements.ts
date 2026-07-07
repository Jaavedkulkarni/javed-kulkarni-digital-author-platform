import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commerceQueryKeys } from '../query/queryKeys';
import type { GrantEntitlementInput } from '../types/entitlement.types';
import { useCommerceServices } from './useCommerceServices';

export function useEntitlements(userId: string | null | undefined) {
  const { entitlements } = useCommerceServices();

  return useQuery({
    queryKey: commerceQueryKeys.entitlements(userId ?? 'guest'),
    queryFn: () => entitlements.listByUser(userId!),
    enabled: Boolean(userId),
  });
}

export function useEntitlementCheck(userId: string | null | undefined, bookId: string | null | undefined) {
  const { entitlements } = useCommerceServices();

  return useQuery({
    queryKey: commerceQueryKeys.entitlement(userId ?? 'guest', bookId ?? 'guest'),
    queryFn: () => entitlements.check(userId!, bookId!),
    enabled: Boolean(userId && bookId),
  });
}

export function useEntitlementMutations(userId: string | null | undefined) {
  const { entitlements } = useCommerceServices();
  const queryClient = useQueryClient();

  const invalidate = () => {
    if (!userId) return;
    void queryClient.invalidateQueries({ queryKey: commerceQueryKeys.entitlements(userId) });
  };

  const grantMutation = useMutation({
    mutationFn: (input: GrantEntitlementInput) => entitlements.grant(input),
    onSuccess: invalidate,
  });

  return { grantMutation };
}
