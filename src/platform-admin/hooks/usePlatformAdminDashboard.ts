import { useQuery } from '@tanstack/react-query';
import { platformAdminQueryKeys } from '../query/queryKeys';
import { usePlatformAdminServices } from './usePlatformAdminServices';

export function usePlatformAdminDashboard() {
  const { dashboard, notifications } = usePlatformAdminServices();

  const overviewQuery = useQuery({
    queryKey: platformAdminQueryKeys.dashboard(),
    queryFn: () => ({
      overview: dashboard.getOverview(),
      pendingTasks: dashboard.getPendingTasks(),
      recentActivity: dashboard.getRecentActivity(),
      calendar: dashboard.getCalendar(),
      performance: dashboard.getDepartmentPerformance(),
      quickActions: dashboard.getQuickActions(),
      notifications: notifications.list(),
    }),
  });

  return {
    ...overviewQuery.data,
    isLoading: overviewQuery.isLoading,
    refetch: overviewQuery.refetch,
  };
}
