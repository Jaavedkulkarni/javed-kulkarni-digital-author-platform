import { useQuery } from '@tanstack/react-query';
import { platformAdminQueryKeys } from '../query/queryKeys';
import { usePlatformAdminServices } from './usePlatformAdminServices';

export function useMarketing() {
  const { marketing } = usePlatformAdminServices();

  const query = useQuery({
    queryKey: platformAdminQueryKeys.marketing(),
    queryFn: () => ({
      campaigns: marketing.getCampaigns(),
      coupons: marketing.getCoupons(),
      banners: marketing.getBanners(),
      announcements: marketing.getAnnouncements(),
      emailQueue: marketing.getEmailQueue(),
    }),
  });

  return { ...query.data, isLoading: query.isLoading, refetch: query.refetch };
}
