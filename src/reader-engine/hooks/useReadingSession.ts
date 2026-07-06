import { useCallback, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useReaderUserId } from '../../reader/hooks/useReaderUserId';
import { readerQueryKeys } from '../../reader/query/queryKeys';
import { readerEngineQueryKeys } from '../query/queryKeys';
import { useReaderEngineServices } from './useReaderEngineServices';
import { buildDeviceInfo } from '../utils/device';
import type { ReaderFormat } from '../types/common';
import type { ReadingSession } from '../types/session.types';

export function useReadingSession(bookId: string, format: ReaderFormat = 'epub') {
  const userId = useReaderUserId();
  const { session, bookLoader, position } = useReaderEngineServices();
  const queryClient = useQueryClient();
  const [activeSession, setActiveSession] = useState<ReadingSession | null>(null);

  const positionQuery = useQuery({
    queryKey: readerEngineQueryKeys.position(userId ?? 'guest', bookId),
    queryFn: () => (userId ? position.getPosition(userId, bookId) : null),
    enabled: Boolean(userId),
  });

  const bookQuery = useQuery({
    queryKey: readerEngineQueryKeys.book(bookId, format),
    queryFn: () => bookLoader.loadBook(bookId, format),
    enabled: Boolean(bookId),
  });

  const startSession = useCallback(async () => {
    if (!userId) return { success: false as const, errors: ['Sign in to read.'] };

    const result = session.start({
      userId,
      bookId,
      format,
      resumeLocation: positionQuery.data?.location,
      deviceInfo: buildDeviceInfo(),
    });

    if (result.success && result.session) {
      const activated = session.activate(result.session.id);
      setActiveSession(activated);
    }
    return result;
  }, [userId, bookId, format, session, positionQuery.data]);

  const closeSession = useCallback(() => {
    if (activeSession) {
      session.close(activeSession.id);
      setActiveSession(null);
      if (userId) {
        void queryClient.invalidateQueries({ queryKey: readerQueryKeys.readingProgress(userId) });
        void queryClient.invalidateQueries({ queryKey: readerEngineQueryKeys.position(userId, bookId) });
      }
    }
  }, [activeSession, session, userId, bookId, queryClient]);

  return {
    session: activeSession,
    book: bookQuery.data,
    position: positionQuery.data,
    isLoading: bookQuery.isLoading || positionQuery.isLoading,
    startSession,
    closeSession,
  };
}
