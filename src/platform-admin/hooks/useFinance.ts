import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { platformAdminQueryKeys } from '../query/queryKeys';
import { usePlatformAdminServices } from './usePlatformAdminServices';

export function useFinance() {
  const { finance } = usePlatformAdminServices();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: platformAdminQueryKeys.finance(),
    queryFn: () => ({
      wallets: finance.getWalletReviews(),
      withdrawals: finance.getWithdrawals(),
      refunds: finance.getRefunds(),
      pendingSettlements: finance.getPendingSettlements(),
      completedSettlements: finance.getCompletedSettlements(),
      revenue: finance.getRevenueSnapshot(),
    }),
  });

  const approveWithdrawalMutation = useMutation({
    mutationFn: (id: string) => finance.approveWithdrawal(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: platformAdminQueryKeys.finance() }),
  });

  const refundMutation = useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) => finance.processRefund(id, approved),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: platformAdminQueryKeys.finance() }),
  });

  return { ...query.data, isLoading: query.isLoading, approveWithdrawalMutation, refundMutation, refetch: query.refetch };
}
