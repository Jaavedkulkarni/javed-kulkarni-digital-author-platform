import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getBrowserClient } from '../../lib/supabase/clients/browser';
import { organizationQueryKeys } from '../query/queryKeys';
import { useRoles as useAppRoles } from '../../context/RoleContext';

export function useOrganizationRealtime() {
  const { profile } = useAppRoles();
  const queryClient = useQueryClient();
  const client = getBrowserClient();
  const userId = profile?.id;

  useEffect(() => {
    if (!userId) return;

    const invalidate = (key: readonly unknown[]) => {
      void queryClient.invalidateQueries({ queryKey: key });
    };

    const userRolesChannel = client
      .channel(`org-user-roles-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_roles', filter: `user_id=eq.${userId}` },
        () => {
          invalidate(organizationQueryKeys.roles(userId));
          invalidate(organizationQueryKeys.workspace(userId));
        }
      )
      .subscribe();

    const profilesChannel = client
      .channel(`org-profile-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` },
        () => invalidate(organizationQueryKeys.roles(userId))
      )
      .subscribe();

    return () => {
      void client.removeChannel(userRolesChannel);
      void client.removeChannel(profilesChannel);
    };
  }, [userId, queryClient, client]);
}
