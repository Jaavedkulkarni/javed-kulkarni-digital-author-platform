import { useQuery } from '@tanstack/react-query';
import { authorQueryKeys } from '../query/queryKeys';
import { useAuthorServices } from './useAuthorServices';
import { useAuthorContext } from './useAuthorContext';

export function useBookPerformance(bookId?: string) {
  const { authorId } = useAuthorContext();
  const { performance } = useAuthorServices();

  const dashboardQuery = useQuery({
    queryKey: authorQueryKeys.performance(authorId ?? 'guest'),
    queryFn: () => performance.getDashboard(authorId!),
    enabled: Boolean(authorId),
  });

  const bookQuery = useQuery({
    queryKey: authorQueryKeys.bookPerformance(authorId ?? 'guest', bookId ?? ''),
    queryFn: () => performance.getBookPerformance(authorId!, bookId!),
    enabled: Boolean(authorId && bookId),
  });

  return {
    dashboard: dashboardQuery.data ?? [],
    bookPerformance: bookQuery.data,
    isLoading: dashboardQuery.isLoading,
  };
}
