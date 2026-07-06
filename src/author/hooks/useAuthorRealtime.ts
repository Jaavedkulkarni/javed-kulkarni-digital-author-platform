import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getBrowserClient } from '../../lib/supabase/clients/browser';
import { authorQueryKeys } from '../query/queryKeys';
import { useAuthorContext } from './useAuthorContext';
import { useRoles } from '../../context/RoleContext';

export function useAuthorRealtime() {
  const { authorId } = useAuthorContext();
  const { profile } = useRoles();
  const queryClient = useQueryClient();
  const client = getBrowserClient();

  useEffect(() => {
    if (!authorId) return;

    const invalidate = (key: readonly unknown[]) => {
      void queryClient.invalidateQueries({ queryKey: key });
    };

    const booksChannel = client
      .channel(`author-books-${authorId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'books', filter: `author_id=eq.${authorId}` },
        () => invalidate(authorQueryKeys.books(authorId))
      )
      .subscribe();

    const analyticsChannel = client
      .channel(`author-analytics-${authorId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'analytics_events' }, () =>
        invalidate(authorQueryKeys.analytics(authorId))
      )
      .subscribe();

    let notificationsChannel: ReturnType<typeof client.channel> | null = null;
    if (profile?.id) {
      notificationsChannel = client
        .channel(`author-notifications-${profile.id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${profile.id}` },
          () => invalidate(authorQueryKeys.notifications(profile.id))
        )
        .subscribe();
    }

    return () => {
      void client.removeChannel(booksChannel);
      void client.removeChannel(analyticsChannel);
      if (notificationsChannel) void client.removeChannel(notificationsChannel);
    };
  }, [authorId, profile?.id, queryClient, client]);
}
