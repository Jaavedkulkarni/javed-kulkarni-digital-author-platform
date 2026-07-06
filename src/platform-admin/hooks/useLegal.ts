import { useQuery } from '@tanstack/react-query';
import { platformAdminQueryKeys } from '../query/queryKeys';
import { usePlatformAdminServices } from './usePlatformAdminServices';

export function useLegal() {
  const { legal } = usePlatformAdminServices();

  const query = useQuery({
    queryKey: platformAdminQueryKeys.legal(),
    queryFn: () => ({
      copyrightClaims: legal.getCopyrightClaims(),
      dmca: legal.getDmcaRequests(),
      contracts: legal.getContracts(),
      violations: legal.getPolicyViolations(),
      disputes: legal.getDisputes(),
    }),
  });

  return { ...query.data, isLoading: query.isLoading, refetch: query.refetch };
}
