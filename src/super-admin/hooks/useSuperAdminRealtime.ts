import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getBrowserClient } from '../../lib/supabase/clients/browser';
import { superAdminQueryKeys } from '../query/queryKeys';

export function useSuperAdminRealtime() {
  const queryClient = useQueryClient();
  const client = getBrowserClient();

  useEffect(() => {
    const invalidate = (key: readonly unknown[]) => void queryClient.invalidateQueries({ queryKey: key });
    const ch = client
      .channel('super-admin-executive')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'analytics_events' }, () =>
        invalidate(superAdminQueryKeys.executive())
      )
      .subscribe();
    return () => void client.removeChannel(ch);
  }, [queryClient, client]);
}
