import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commerceQueryKeys } from '../query/queryKeys';
import type { WalletCreditInput, WalletDebitInput } from '../types/wallet.types';
import { useCommerceServices } from './useCommerceServices';

export function useWallet(userId: string | null | undefined) {
  const { wallet } = useCommerceServices();

  const accountQuery = useQuery({
    queryKey: commerceQueryKeys.wallet(userId ?? 'guest'),
    queryFn: () => wallet.getAccount(userId!),
    enabled: Boolean(userId),
  });

  const transactionsQuery = useQuery({
    queryKey: commerceQueryKeys.walletTransactions(userId ?? 'guest'),
    queryFn: () => wallet.listTransactions(userId!),
    enabled: Boolean(userId),
  });

  return { accountQuery, transactionsQuery };
}

export function useWalletMutations(userId: string | null | undefined) {
  const { wallet } = useCommerceServices();
  const queryClient = useQueryClient();

  const invalidate = () => {
    if (!userId) return;
    void queryClient.invalidateQueries({ queryKey: commerceQueryKeys.wallet(userId) });
    void queryClient.invalidateQueries({ queryKey: commerceQueryKeys.walletTransactions(userId) });
  };

  const creditMutation = useMutation({
    mutationFn: (input: WalletCreditInput) => Promise.resolve(wallet.credit(input)),
    onSuccess: invalidate,
  });

  const debitMutation = useMutation({
    mutationFn: (input: WalletDebitInput) => Promise.resolve(wallet.debit(input)),
    onSuccess: invalidate,
  });

  return { creditMutation, debitMutation };
}
