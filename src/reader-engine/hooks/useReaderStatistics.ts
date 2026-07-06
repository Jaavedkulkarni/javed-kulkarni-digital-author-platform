import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useReaderUserId } from '../../reader/hooks/useReaderUserId';
import { readerEngineQueryKeys } from '../query/queryKeys';
import { useReaderEngineServices } from './useReaderEngineServices';

export function useReaderStatistics() {
  const userId = useReaderUserId();
  const { progress, statistics, lastRead } = useReaderEngineServices();

  const query = useQuery({
    queryKey: readerEngineQueryKeys.statistics(userId ?? 'guest'),
    queryFn: async () => {
      const rows = await progress.getAllProgress(userId!);
      return statistics.buildUserStats(rows);
    },
    enabled: Boolean(userId),
  });

  const lastReadQuery = useQuery({
    queryKey: readerEngineQueryKeys.lastRead(userId ?? 'guest'),
    queryFn: () => lastRead.getLastRead(userId!),
    enabled: Boolean(userId),
  });

  const recentlyRead = useMemo(() => lastReadQuery.data, [lastReadQuery.data]);

  return {
    stats: query.data,
    lastRead: recentlyRead,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
