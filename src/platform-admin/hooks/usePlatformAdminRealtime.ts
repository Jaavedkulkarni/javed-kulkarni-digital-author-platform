import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getBrowserClient } from '../../lib/supabase/clients/browser';
import { platformAdminQueryKeys } from '../query/queryKeys';

export function usePlatformAdminRealtime() {
  const queryClient = useQueryClient();
  const client = getBrowserClient();

  useEffect(() => {
    const invalidate = (key: readonly unknown[]) => {
      void queryClient.invalidateQueries({ queryKey: key });
    };

    const channels = [
      client.channel('pa-book-review').on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, () =>
        invalidate(platformAdminQueryKeys.bookReview())
      ),
      client.channel('pa-notifications').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, () =>
        invalidate(platformAdminQueryKeys.notifications())
      ),
    ];

    channels.forEach((ch) => ch.subscribe());

    return () => {
      channels.forEach((ch) => void client.removeChannel(ch));
    };
  }, [queryClient, client]);
}
