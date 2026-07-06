import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useReaderUserId } from '../../reader/hooks/useReaderUserId';
import { readerQueryKeys } from '../../reader/query/queryKeys';
import { readerEngineQueryKeys } from '../query/queryKeys';
import { useReaderEngineServices } from './useReaderEngineServices';
import { buildDeviceInfo } from '../utils/device';
import type { PositionUpdateInput } from '../types/position.types';
import type { DigitalFormat } from '../../types/database';

export function useReaderPosition(bookId: string, format: DigitalFormat = 'epub') {
  const userId = useReaderUserId();
  const { position } = useReaderEngineServices();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: readerEngineQueryKeys.position(userId ?? 'guest', bookId),
    queryFn: () => (userId ? position.getPosition(userId, bookId) : null),
    enabled: Boolean(userId && bookId),
  });

  const updateMutation = useMutation({
    mutationFn: (input: Omit<PositionUpdateInput, 'userId' | 'bookId'>) =>
      position.updatePosition(
        {
          ...input,
          userId: userId!,
          bookId,
          deviceInfo: buildDeviceInfo(),
        },
        format
      ),
    onSuccess: () => {
      if (userId) {
        void queryClient.invalidateQueries({ queryKey: readerEngineQueryKeys.position(userId, bookId) });
        void queryClient.invalidateQueries({ queryKey: readerQueryKeys.readingProgress(userId) });
        void queryClient.invalidateQueries({ queryKey: readerQueryKeys.insights(userId) });
      }
    },
  });

  const computeStats = useCallback(
    (wordsRead: number, totalWords: number) => position.computeStats(wordsRead, totalWords),
    [position]
  );

  return {
    position: query.data,
    isLoading: query.isLoading,
    updatePosition: updateMutation.mutateAsync,
    computeStats,
    isUpdating: updateMutation.isPending,
  };
}
