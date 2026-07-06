import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { readerQueryKeys } from '../query/queryKeys';
import { fetchLibraryBooks } from '../services/library.service';
import { fetchReadingProgress } from '../services/readingProgress.service';
import { buildReadingInsights } from '../services/insights.service';
import { useReaderUserId } from './useReaderUserId';
import { useOnlineStatus } from '../utils/offline';

export function useReadingInsights() {
  const userId = useReaderUserId();
  const isOnline = useOnlineStatus();

  const query = useQuery({
    queryKey: readerQueryKeys.insights(userId ?? 'guest'),
    queryFn: async () => {
      const [progress, library] = await Promise.all([
        fetchReadingProgress(userId!),
        fetchLibraryBooks(userId!),
      ]);
      return buildReadingInsights(progress, library);
    },
    enabled: Boolean(userId) && isOnline,
  });

  const insights = useMemo(
    () =>
      query.data ?? {
        analytics: [],
        readingTime: [],
        streak: [],
        goals: [],
      },
    [query.data]
  );

  return {
    analytics: insights.analytics,
    readingTime: insights.readingTime,
    streak: insights.streak,
    goals: insights.goals,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export default useReadingInsights;
