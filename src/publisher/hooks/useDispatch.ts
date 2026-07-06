import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { publisherQueryKeys } from '../query/queryKeys';
import { usePublisherServices } from './usePublisherServices';
import { usePublisherContext } from './usePublisherContext';

export function useDispatch() {
  const { publisherId } = usePublisherContext();
  const { dispatch } = usePublisherServices();

  const query = useQuery({
    queryKey: publisherQueryKeys.dispatch(publisherId ?? 'guest'),
    queryFn: () => dispatch.list(publisherId!),
    enabled: Boolean(publisherId),
  });

  return { dispatches: query.data ?? [], isLoading: query.isLoading, refetch: query.refetch };
}

export function useDispatchMutations() {
  const { publisherId } = usePublisherContext();
  const { dispatch } = usePublisherServices();
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: publisherQueryKeys.dispatch(publisherId ?? 'guest') });
    void queryClient.invalidateQueries({ queryKey: publisherQueryKeys.production(publisherId ?? 'guest') });
  };

  const createMutation = useMutation({
    mutationFn: (input: {
      jobId: string;
      courier: string;
      trackingNumber: string;
      dispatchDate: string;
      expectedDelivery: string;
    }) => dispatch.createDispatch(publisherId!, input),
    onSuccess: invalidate,
  });

  const confirmDeliveryMutation = useMutation({
    mutationFn: (dispatchId: string) => dispatch.confirmDelivery(publisherId!, dispatchId),
    onSuccess: invalidate,
  });

  return { createMutation, confirmDeliveryMutation };
}
