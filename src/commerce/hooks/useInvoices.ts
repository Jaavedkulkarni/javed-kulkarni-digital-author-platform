import { useQuery } from '@tanstack/react-query';
import { commerceQueryKeys } from '../query/queryKeys';
import { useCommerceServices } from './useCommerceServices';

export function useInvoices(userId: string | null | undefined) {
  const { invoices } = useCommerceServices();

  return useQuery({
    queryKey: commerceQueryKeys.invoices(userId ?? 'guest'),
    queryFn: () => invoices.listByUser(userId!),
    enabled: Boolean(userId),
  });
}

export function useInvoiceByOrder(orderId: string | null | undefined) {
  const { invoices } = useCommerceServices();

  return useQuery({
    queryKey: commerceQueryKeys.invoice(orderId ?? 'guest'),
    queryFn: () => invoices.findByOrderId(orderId!),
    enabled: Boolean(orderId),
  });
}
