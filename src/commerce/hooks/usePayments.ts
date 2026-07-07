import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commerceQueryKeys } from '../query/queryKeys';
import type { PaymentProviderId } from '../types/payment.types';
import { useCommerceServices } from './useCommerceServices';

export function usePaymentMutations() {
  const { payments } = useCommerceServices();
  const queryClient = useQueryClient();

  const captureMutation = useMutation({
    mutationFn: ({
      provider,
      request,
      orderId,
      currentOrderStatus,
    }: {
      provider: PaymentProviderId;
      request: Parameters<typeof payments.capturePayment>[1];
      orderId: string;
      currentOrderStatus: 'processing' | 'pending';
    }) => payments.capturePayment(provider, request, orderId, currentOrderStatus),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: commerceQueryKeys.order(variables.orderId) });
      void queryClient.invalidateQueries({ queryKey: commerceQueryKeys.payments(variables.orderId) });
    },
  });

  const refundMutation = useMutation({
    mutationFn: ({
      provider,
      request,
    }: {
      provider: PaymentProviderId;
      request: Parameters<typeof payments.prepareRefund>[1];
    }) => payments.prepareRefund(provider, request),
  });

  const initiateMutation = useMutation({
    mutationFn: (input: Parameters<typeof payments.initiatePayment>[0]) => payments.initiatePayment(input),
  });

  return { captureMutation, refundMutation, initiateMutation };
}
