import { useQuery } from '@tanstack/react-query';
import { readerQueryKeys } from '../query/queryKeys';
import { fetchDownloads } from '../services/downloads.service';
import { useReaderUserId } from './useReaderUserId';
import { useOnlineStatus } from '../utils/offline';

export function useDownloads() {
  const userId = useReaderUserId();
  const isOnline = useOnlineStatus();

  const query = useQuery({
    queryKey: readerQueryKeys.downloads(userId ?? 'guest'),
    queryFn: () => fetchDownloads(userId!),
    enabled: Boolean(userId) && isOnline,
  });

  return {
    downloads: query.data ?? [],
    datasetEmpty: !query.isLoading && (query.data?.length ?? 0) === 0,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
}

export default useDownloads;
