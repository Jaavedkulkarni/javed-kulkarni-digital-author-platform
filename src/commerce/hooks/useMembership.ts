import { useQuery } from '@tanstack/react-query';
import { commerceQueryKeys } from '../query/queryKeys';
import { useCommerceServices } from './useCommerceServices';

export function useMembership(userId: string | null | undefined) {
  const { memberships } = useCommerceServices();

  return useQuery({
    queryKey: commerceQueryKeys.membership(userId ?? 'guest'),
    queryFn: () => memberships.getContext(userId!),
    enabled: Boolean(userId),
  });
}

export function useActiveMembership(userId: string | null | undefined) {
  const { memberships } = useCommerceServices();

  return useQuery({
    queryKey: [...commerceQueryKeys.membership(userId ?? 'guest'), 'active'],
    queryFn: () => memberships.getActiveByUser(userId!),
    enabled: Boolean(userId),
  });
}
