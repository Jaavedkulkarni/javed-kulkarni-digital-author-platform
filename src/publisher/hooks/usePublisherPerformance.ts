import { useQuery } from '@tanstack/react-query';
import { publisherQueryKeys } from '../query/queryKeys';
import { usePublisherServices } from './usePublisherServices';
import { usePublisherContext } from './usePublisherContext';

export function usePublisherPerformance() {
  const { publisherId } = usePublisherContext();
  const { performance } = usePublisherServices();

  const query = useQuery({
    queryKey: publisherQueryKeys.performance(publisherId ?? 'guest'),
    queryFn: () => performance.getMetrics(publisherId!),
    enabled: Boolean(publisherId),
  });

  return { metrics: query.data, isLoading: query.isLoading, refetch: query.refetch };
}
