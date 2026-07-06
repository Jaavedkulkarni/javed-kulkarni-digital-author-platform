import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authorQueryKeys } from '../query/queryKeys';
import { useAuthorServices } from './useAuthorServices';
import { useAuthorContext } from './useAuthorContext';
import type { CreateWithdrawalInput } from '../types/payouts.types';

export function useAuthorEarnings() {
  const { authorId } = useAuthorContext();
  const { earnings } = useAuthorServices();
  const queryClient = useQueryClient();

  const balanceQuery = useQuery({
    queryKey: authorQueryKeys.earnings(authorId ?? 'guest'),
    queryFn: () => Promise.resolve(earnings.getBalance(authorId!)),
    enabled: Boolean(authorId),
  });

  const payoutsQuery = useQuery({
    queryKey: authorQueryKeys.payouts(authorId ?? 'guest'),
    queryFn: () => Promise.resolve(earnings.getPayoutHistory(authorId!)),
    enabled: Boolean(authorId),
  });

  const withdrawalsQuery = useQuery({
    queryKey: authorQueryKeys.withdrawals(authorId ?? 'guest'),
    queryFn: () => Promise.resolve(earnings.getWithdrawalRequests(authorId!)),
    enabled: Boolean(authorId),
  });

  const withdrawMutation = useMutation({
    mutationFn: (input: Omit<CreateWithdrawalInput, 'authorId'>) =>
      Promise.resolve(earnings.requestWithdrawal({ ...input, authorId: authorId! })),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authorQueryKeys.earnings(authorId!) });
      void queryClient.invalidateQueries({ queryKey: authorQueryKeys.withdrawals(authorId!) });
    },
  });

  return {
    balance: balanceQuery.data,
    payouts: payoutsQuery.data ?? [],
    withdrawals: withdrawalsQuery.data ?? [],
    requestWithdrawal: withdrawMutation.mutateAsync,
    isLoading: balanceQuery.isLoading,
    isWithdrawing: withdrawMutation.isPending,
  };
}
