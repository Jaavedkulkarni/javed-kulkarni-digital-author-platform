import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getReaderDataAccess } from '../infrastructure/readerDataAccess';
import { readerQueryKeys } from '../query/queryKeys';
import { useReaderUserId } from '../hooks/useReaderUserId';

export function useReaderRealtime() {
  const userId = useReaderUserId();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const { client } = getReaderDataAccess();

    const invalidate = (key: readonly unknown[]) => {
      void queryClient.invalidateQueries({ queryKey: key });
    };

    const libraryChannel = client
      .channel(`reader-library-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'library', filter: `user_id=eq.${userId}` },
        () => invalidate(readerQueryKeys.library(userId))
      )
      .subscribe();

    const notificationsChannel = client
      .channel(`reader-notifications-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        () => invalidate(readerQueryKeys.notifications(userId))
      )
      .subscribe();

    const progressChannel = client
      .channel(`reader-progress-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reading_progress', filter: `user_id=eq.${userId}` },
        () => {
          invalidate(readerQueryKeys.readingProgress(userId));
          invalidate(readerQueryKeys.insights(userId));
          invalidate(readerQueryKeys.profile(userId));
        }
      )
      .subscribe();

    const membershipChannel = client
      .channel(`reader-membership-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'memberships', filter: `user_id=eq.${userId}` },
        () => {
          invalidate(readerQueryKeys.membership(userId));
          invalidate(readerQueryKeys.profile(userId));
        }
      )
      .subscribe();

    return () => {
      void client.removeChannel(libraryChannel);
      void client.removeChannel(notificationsChannel);
      void client.removeChannel(progressChannel);
      void client.removeChannel(membershipChannel);
    };
  }, [queryClient, userId]);
}
