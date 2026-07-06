import { useQuery } from '@tanstack/react-query';
import { superAdminQueryKeys } from '../query/queryKeys';
import { useSuperAdminServices } from './useSuperAdminServices';

export function useAnalytics() {
  const { analytics } = useSuperAdminServices();
  const query = useQuery({ queryKey: superAdminQueryKeys.analytics(), queryFn: () => analytics.getSnapshot() });
  return { snapshot: query.data, isLoading: query.isLoading, refetch: query.refetch };
}
