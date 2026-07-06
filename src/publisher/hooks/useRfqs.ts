import { useQuery } from '@tanstack/react-query';
import { publisherQueryKeys } from '../query/queryKeys';
import { usePublisherServices } from './usePublisherServices';
import { usePublisherContext } from './usePublisherContext';

export function useRfqs() {
  const { publisherId } = usePublisherContext();
  const { rfq } = usePublisherServices();

  const listQuery = useQuery({
    queryKey: publisherQueryKeys.rfqs(publisherId ?? 'guest'),
    queryFn: () => rfq.list(publisherId!),
    enabled: Boolean(publisherId),
  });

  const pendingQuery = useQuery({
    queryKey: publisherQueryKeys.rfqs(`${publisherId ?? 'guest'}-pending`),
    queryFn: () => rfq.listPending(publisherId!),
    enabled: Boolean(publisherId),
  });

  return {
    rfqs: listQuery.data ?? [],
    pendingRfqs: pendingQuery.data ?? [],
    expiredRfqs: publisherId ? rfq.listExpired(publisherId) : [],
    isLoading: listQuery.isLoading,
    refetch: listQuery.refetch,
  };
}

export function useRfq(rfqId: string | null) {
  const { publisherId } = usePublisherContext();
  const { rfq } = usePublisherServices();

  const query = useQuery({
    queryKey: publisherQueryKeys.rfq(publisherId ?? 'guest', rfqId ?? ''),
    queryFn: () => rfq.getById(publisherId!, rfqId!),
    enabled: Boolean(publisherId && rfqId),
  });

  return { rfq: query.data ?? null, isLoading: query.isLoading };
}
