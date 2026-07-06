import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { platformAdminQueryKeys } from '../query/queryKeys';
import { usePlatformAdminServices } from './usePlatformAdminServices';

export function usePaperbackOperations() {
  const { paperback } = usePlatformAdminServices();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: platformAdminQueryKeys.paperback(),
    queryFn: () => ({
      requests: paperback.getRequests(),
      rfqs: paperback.getRfqs(),
      quotes: paperback.getQuoteComparisons(),
      production: paperback.getProductionTracking(),
    }),
  });

  const createRfqMutation = useMutation({
    mutationFn: (requestId: string) => paperback.createRfq(requestId),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: platformAdminQueryKeys.paperback() }),
  });

  const assignMutation = useMutation({
    mutationFn: ({ requestId, publisher }: { requestId: string; publisher: string }) =>
      paperback.assignPublisher(requestId, publisher),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: platformAdminQueryKeys.paperback() }),
  });

  return { ...query.data, isLoading: query.isLoading, createRfqMutation, assignMutation, refetch: query.refetch };
}
