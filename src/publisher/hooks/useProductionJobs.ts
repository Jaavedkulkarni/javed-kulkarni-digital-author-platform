import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { publisherQueryKeys } from '../query/queryKeys';
import { usePublisherServices } from './usePublisherServices';
import { usePublisherContext } from './usePublisherContext';
import type { ProductionJobStatus } from '../types/common';

export function useProductionJobs(status?: ProductionJobStatus) {
  const { publisherId } = usePublisherContext();
  const { production } = usePublisherServices();

  const query = useQuery({
    queryKey: publisherQueryKeys.production(publisherId ?? 'guest', status),
    queryFn: () =>
      status ? production.listByStatus(publisherId!, status) : production.list(publisherId!),
    enabled: Boolean(publisherId),
  });

  return { jobs: query.data ?? [], isLoading: query.isLoading, refetch: query.refetch };
}

export function useProductionJob(jobId: string | null) {
  const { publisherId } = usePublisherContext();
  const { production } = usePublisherServices();

  const query = useQuery({
    queryKey: publisherQueryKeys.job(publisherId ?? 'guest', jobId ?? ''),
    queryFn: () => production.getById(publisherId!, jobId!),
    enabled: Boolean(publisherId && jobId),
  });

  return { job: query.data ?? null, isLoading: query.isLoading };
}

export function useProductionJobMutations() {
  const { publisherId } = usePublisherContext();
  const { production } = usePublisherServices();
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: publisherQueryKeys.production(publisherId ?? 'guest') });
    void queryClient.invalidateQueries({ queryKey: publisherQueryKeys.dashboard(publisherId ?? 'guest') });
  };

  const advanceStatusMutation = useMutation({
    mutationFn: ({ jobId, status }: { jobId: string; status: ProductionJobStatus }) =>
      production.advanceStatus(publisherId!, jobId, status),
    onMutate: async ({ jobId, status }) => {
      const key = publisherQueryKeys.production(publisherId ?? 'guest');
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key);
      queryClient.setQueryData(key, (old: typeof previous) => {
        if (!Array.isArray(old)) return old;
        return old.map((j) => (j.id === jobId ? { ...j, status } : j));
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          publisherQueryKeys.production(publisherId ?? 'guest'),
          context.previous
        );
      }
    },
    onSettled: invalidate,
  });

  return { advanceStatusMutation };
}
