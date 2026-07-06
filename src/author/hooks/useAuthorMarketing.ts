import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authorQueryKeys } from '../query/queryKeys';
import { useAuthorServices } from './useAuthorServices';
import { useAuthorContext } from './useAuthorContext';

export function useAuthorMarketing() {
  const { authorId } = useAuthorContext();
  const { marketing } = useAuthorServices();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: authorQueryKeys.marketing(authorId ?? 'guest'),
    queryFn: () =>
      Promise.resolve({
        summary: marketing.getSummary(authorId!),
        promoLinks: marketing.getPromoLinks(authorId!),
        referrals: marketing.getReferrals(authorId!),
        campaigns: marketing.getCampaigns(authorId!),
        coupons: marketing.getCouponPerformance(authorId!),
      }),
    enabled: Boolean(authorId),
  });

  const createPromoMutation = useMutation({
    mutationFn: (input: { bookId?: string | null; label: string; slug: string }) =>
      Promise.resolve(marketing.createPromoLink(authorId!, input)),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: authorQueryKeys.marketing(authorId!) }),
  });

  return {
    ...query.data,
    isLoading: query.isLoading,
    createPromoLink: createPromoMutation.mutateAsync,
  };
}
