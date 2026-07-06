import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useReaderUserId } from '../../reader/hooks/useReaderUserId';
import { readerQueryKeys } from '../../reader/query/queryKeys';
import { readerEngineQueryKeys } from '../query/queryKeys';
import { useReaderEngineServices } from './useReaderEngineServices';
import type { CreateNoteInput } from '../types/note.types';

export function useNotes(bookId: string) {
  const userId = useReaderUserId();
  const { notes } = useReaderEngineServices();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: readerEngineQueryKeys.notes(userId ?? 'guest', bookId),
    queryFn: () => notes.list(userId!, bookId),
    enabled: Boolean(userId && bookId),
  });

  const createMutation = useMutation({
    mutationFn: (input: Omit<CreateNoteInput, 'userId' | 'bookId'>) =>
      notes.create({ ...input, userId: userId!, bookId }),
    onSuccess: () => {
      if (userId) {
        void queryClient.invalidateQueries({ queryKey: readerEngineQueryKeys.notes(userId, bookId) });
        void queryClient.invalidateQueries({ queryKey: readerQueryKeys.readingProgress(userId) });
      }
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => notes.remove(id),
    onSuccess: () => {
      if (userId) {
        void queryClient.invalidateQueries({ queryKey: readerEngineQueryKeys.notes(userId, bookId) });
      }
    },
  });

  return {
    notes: query.data ?? [],
    isLoading: query.isLoading,
    createNote: createMutation.mutateAsync,
    removeNote: removeMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
