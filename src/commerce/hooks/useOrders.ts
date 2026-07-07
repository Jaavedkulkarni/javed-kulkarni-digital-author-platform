import { useQuery } from '@tanstack/react-query';
import { commerceQueryKeys } from '../query/queryKeys';
import { useCommerceServices } from './useCommerceServices';

export function useOrders(userId: string | null | undefined) {
  const { orders } = useCommerceServices();

  return useQuery({
    queryKey: commerceQueryKeys.orders(userId ?? 'guest'),
    queryFn: () => orders.listByUser(userId!),
    enabled: Boolean(userId),
  });
}

export function useOrder(orderId: string | null | undefined) {
  const { orders } = useCommerceServices();

  return useQuery({
    queryKey: commerceQueryKeys.order(orderId ?? 'guest'),
    queryFn: () => orders.getById(orderId!),
    enabled: Boolean(orderId),
  });
}
