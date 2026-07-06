import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useReaderUserId } from '../../reader/hooks/useReaderUserId';
import { readerQueryKeys } from '../../reader/query/queryKeys';
import { readerEngineQueryKeys } from '../query/queryKeys';
import { useReaderEngineServices } from './useReaderEngineServices';
import type { CreateBookmarkInput } from '../types/bookmark.types';

export function useBookmarks(bookId: string) {
  const userId = useReaderUserId();
  const { bookmarks } = useReaderEngineServices();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: readerEngineQueryKeys.bookmarks(userId ?? 'guest', bookId),
    queryFn: () => bookmarks.list(userId!, bookId),
    enabled: Boolean(userId && bookId),
  });

  const createMutation = useMutation({
    mutationFn: (input: Omit<CreateBookmarkInput, 'userId' | 'bookId'>) =>
      bookmarks.create({ ...input, userId: userId!, bookId }),
    onSuccess: () => {
      if (userId) {
        void queryClient.invalidateQueries({ queryKey: readerEngineQueryKeys.bookmarks(userId, bookId) });
        void queryClient.invalidateQueries({ queryKey: readerQueryKeys.readingProgress(userId) });
      }
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => bookmarks.remove(id),
    onSuccess: () => {
      if (userId) {
        void queryClient.invalidateQueries({ queryKey: readerEngineQueryKeys.bookmarks(userId, bookId) });
      }
    },
  });

  return {
    bookmarks: query.data ?? [],
    isLoading: query.isLoading,
    createBookmark: createMutation.mutateAsync,
    removeBookmark: removeMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
