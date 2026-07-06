import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { publisherQueryKeys } from '../query/queryKeys';
import { usePublisherServices } from './usePublisherServices';
import { usePublisherContext } from './usePublisherContext';
import type { SubmitQuoteInput, UpdateQuoteInput } from '../types/quote.types';

export function useQuotes(status?: string) {
  const { publisherId } = usePublisherContext();
  const { quotes } = usePublisherServices();

  const query = useQuery({
    queryKey: publisherQueryKeys.quotes(publisherId ?? 'guest', status),
    queryFn: () =>
      status
        ? quotes.listByStatus(publisherId!, status as 'pending' | 'submitted' | 'won' | 'lost' | 'expired')
        : quotes.list(publisherId!),
    enabled: Boolean(publisherId),
  });

  return { quotes: query.data ?? [], isLoading: query.isLoading, refetch: query.refetch };
}

export function useQuoteMutations() {
  const { publisherId } = usePublisherContext();
  const { quotes } = usePublisherServices();
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: publisherQueryKeys.quotes(publisherId ?? 'guest') });
    void queryClient.invalidateQueries({ queryKey: publisherQueryKeys.dashboard(publisherId ?? 'guest') });
  };

  const submitMutation = useMutation({
    mutationFn: (input: Omit<SubmitQuoteInput, 'publisherId'>) =>
      quotes.submit({ ...input, publisherId: publisherId! }),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: (input: Omit<UpdateQuoteInput, 'publisherId'>) =>
      quotes.update({ ...input, publisherId: publisherId! }),
    onMutate: async (input) => {
      const key = publisherQueryKeys.quotes(publisherId ?? 'guest');
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key);
      queryClient.setQueryData(key, (old: typeof previous) => {
        if (!Array.isArray(old)) return old;
        return old.map((q) =>
          q.id === input.quoteId
            ? {
                ...q,
                unitPrice: input.unitPrice ?? q.unitPrice,
                leadTimeDays: input.leadTimeDays ?? q.leadTimeDays,
                notes: input.notes !== undefined ? input.notes : q.notes,
              }
            : q
        );
      });
      return { previous };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          publisherQueryKeys.quotes(publisherId ?? 'guest'),
          context.previous
        );
      }
    },
    onSettled: invalidate,
  });

  const withdrawMutation = useMutation({
    mutationFn: (quoteId: string) => quotes.withdraw(publisherId!, quoteId),
    onSuccess: invalidate,
  });

  return { submitMutation, updateMutation, withdrawMutation };
}
