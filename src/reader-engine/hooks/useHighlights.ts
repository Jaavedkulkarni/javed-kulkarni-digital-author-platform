import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useReaderUserId } from '../../reader/hooks/useReaderUserId';
import { readerQueryKeys } from '../../reader/query/queryKeys';
import { readerEngineQueryKeys } from '../query/queryKeys';
import { useReaderEngineServices } from './useReaderEngineServices';
import type { CreateHighlightInput } from '../types/highlight.types';

export function useHighlights(bookId: string) {
  const userId = useReaderUserId();
  const { highlights } = useReaderEngineServices();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: readerEngineQueryKeys.highlights(userId ?? 'guest', bookId),
    queryFn: () => highlights.list(userId!, bookId),
    enabled: Boolean(userId && bookId),
  });

  const createMutation = useMutation({
    mutationFn: (input: Omit<CreateHighlightInput, 'userId' | 'bookId'>) =>
      highlights.create({ ...input, userId: userId!, bookId }),
    onSuccess: () => {
      if (userId) {
        void queryClient.invalidateQueries({ queryKey: readerEngineQueryKeys.highlights(userId, bookId) });
        void queryClient.invalidateQueries({ queryKey: readerQueryKeys.readingProgress(userId) });
      }
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => highlights.remove(id),
    onSuccess: () => {
      if (userId) {
        void queryClient.invalidateQueries({ queryKey: readerEngineQueryKeys.highlights(userId, bookId) });
      }
    },
  });

  return {
    highlights: query.data ?? [],
    isLoading: query.isLoading,
    createHighlight: createMutation.mutateAsync,
    removeHighlight: removeMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
