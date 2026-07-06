import { useQuery } from '@tanstack/react-query';
import { superAdminQueryKeys } from '../query/queryKeys';
import { useSuperAdminServices } from './useSuperAdminServices';

export function usePlatformConfiguration() {
  const { platform } = useSuperAdminServices();
  const query = useQuery({
    queryKey: superAdminQueryKeys.platform(),
    queryFn: () => platform.list(),
  });
  return { configs: query.data ?? [], isLoading: query.isLoading, refetch: query.refetch };
}
