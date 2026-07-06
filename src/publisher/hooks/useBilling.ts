import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { publisherQueryKeys } from '../query/queryKeys';
import { usePublisherServices } from './usePublisherServices';
import { usePublisherContext } from './usePublisherContext';

export function useBilling() {
  const { publisherId } = usePublisherContext();
  const { billing } = usePublisherServices();

  const invoicesQuery = useQuery({
    queryKey: publisherQueryKeys.billing(publisherId ?? 'guest'),
    queryFn: () => billing.listInvoices(publisherId!),
    enabled: Boolean(publisherId),
  });

  const paymentsQuery = useQuery({
    queryKey: publisherQueryKeys.payments(publisherId ?? 'guest'),
    queryFn: () => billing.listPaymentRequests(publisherId!),
    enabled: Boolean(publisherId),
  });

  return {
    invoices: invoicesQuery.data ?? [],
    paymentRequests: paymentsQuery.data ?? [],
    isLoading: invoicesQuery.isLoading || paymentsQuery.isLoading,
    refetch: () => {
      void invoicesQuery.refetch();
      void paymentsQuery.refetch();
    },
  };
}

export function useBillingMutations() {
  const { publisherId } = usePublisherContext();
  const { billing } = usePublisherServices();
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: publisherQueryKeys.billing(publisherId ?? 'guest') });
    void queryClient.invalidateQueries({ queryKey: publisherQueryKeys.payments(publisherId ?? 'guest') });
  };

  const uploadInvoiceMutation = useMutation({
    mutationFn: (input: {
      jobId: string;
      invoiceNumber: string;
      amount: number;
      gstAmount: number;
      isGstInvoice: boolean;
      storagePath?: string | null;
    }) => billing.uploadInvoice(publisherId!, input),
    onSuccess: invalidate,
  });

  const requestPaymentMutation = useMutation({
    mutationFn: (invoiceId: string) => billing.requestPayment(publisherId!, invoiceId),
    onSuccess: invalidate,
  });

  return { uploadInvoiceMutation, requestPaymentMutation };
}
