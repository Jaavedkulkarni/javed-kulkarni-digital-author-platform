import { useQuery } from '@tanstack/react-query';
import { authorQueryKeys } from '../query/queryKeys';
import { useAuthorServices } from './useAuthorServices';
import { useAuthorContext } from './useAuthorContext';

export function useBookAnalytics(bookId: string) {
  const { authorId } = useAuthorContext();
  const { analytics } = useAuthorServices();

  return useQuery({
    queryKey: authorQueryKeys.bookAnalytics(authorId ?? 'guest', bookId),
    queryFn: () => analytics.getBookAnalytics(authorId!, bookId),
    enabled: Boolean(authorId && bookId),
  });
}

export function useAuthorAnalytics() {
  const { authorId } = useAuthorContext();
  const { analytics } = useAuthorServices();

  return useQuery({
    queryKey: authorQueryKeys.analytics(authorId ?? 'guest'),
    queryFn: () => analytics.getSummary(authorId!),
    enabled: Boolean(authorId),
  });
}
