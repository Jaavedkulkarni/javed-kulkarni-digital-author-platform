import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { publisherQueryKeys } from '../query/queryKeys';
import { usePublisherServices } from './usePublisherServices';
import { usePublisherContext } from './usePublisherContext';
import type { UpdateCompanyProfileInput } from '../types/company.types';

export function useCompanyProfile() {
  const { publisherId, companyName } = usePublisherContext();
  const { company } = usePublisherServices();

  const query = useQuery({
    queryKey: publisherQueryKeys.company(publisherId ?? 'guest'),
    queryFn: () => company.get(publisherId!, companyName ?? 'Publisher'),
    enabled: Boolean(publisherId),
  });

  return { profile: query.data, isLoading: query.isLoading, refetch: query.refetch };
}

export function useCompanyProfileMutations() {
  const { publisherId } = usePublisherContext();
  const { company } = usePublisherServices();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (input: UpdateCompanyProfileInput) => company.update(publisherId!, input),
    onMutate: async (input) => {
      const key = publisherQueryKeys.company(publisherId ?? 'guest');
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key);
      queryClient.setQueryData(key, (old: typeof previous) => {
        if (!old || typeof old !== 'object') return old;
        return { ...old, ...input };
      });
      return { previous };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(publisherQueryKeys.company(publisherId ?? 'guest'), context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: publisherQueryKeys.company(publisherId ?? 'guest') });
    },
  });

  return { updateMutation };
}
