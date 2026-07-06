import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getBrowserClient } from '../../lib/supabase/clients/browser';
import { publisherQueryKeys } from '../query/queryKeys';
import { usePublisherContext } from './usePublisherContext';

export function usePublisherRealtime() {
  const { publisherId } = usePublisherContext();
  const queryClient = useQueryClient();
  const client = getBrowserClient();

  useEffect(() => {
    if (!publisherId) return;

    const invalidate = (key: readonly unknown[]) => {
      void queryClient.invalidateQueries({ queryKey: key });
    };

    const publisherChannel = client
      .channel(`publisher-profile-${publisherId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'publishers', filter: `id=eq.${publisherId}` },
        () => invalidate(publisherQueryKeys.company(publisherId))
      )
      .subscribe();

    return () => {
      void client.removeChannel(publisherChannel);
    };
  }, [publisherId, queryClient, client]);
}
