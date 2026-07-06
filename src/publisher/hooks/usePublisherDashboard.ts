import { useQuery } from '@tanstack/react-query';
import { publisherQueryKeys } from '../query/queryKeys';
import { usePublisherServices } from './usePublisherServices';
import { usePublisherContext } from './usePublisherContext';

export function usePublisherDashboard() {
  const { publisherId } = usePublisherContext();
  const { dashboard } = usePublisherServices();

  const overviewQuery = useQuery({
    queryKey: publisherQueryKeys.dashboard(publisherId ?? 'guest'),
    queryFn: () => dashboard.getOverview(publisherId!),
    enabled: Boolean(publisherId),
  });

  return {
    overview: overviewQuery.data,
    isLoading: overviewQuery.isLoading,
    refetch: overviewQuery.refetch,
  };
}
