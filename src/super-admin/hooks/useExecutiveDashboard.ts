import { useQuery } from '@tanstack/react-query';
import { superAdminQueryKeys } from '../query/queryKeys';
import { useSuperAdminServices } from './useSuperAdminServices';

export function useExecutiveDashboard() {
  const { executive } = useSuperAdminServices();
  const query = useQuery({
    queryKey: superAdminQueryKeys.executive(),
    queryFn: () => ({
      overview: executive.getOverview(),
      activities: executive.getRecentActivities(),
      systemStatus: executive.getSystemStatus(),
    }),
  });
  return { ...query.data, isLoading: query.isLoading, refetch: query.refetch };
}
