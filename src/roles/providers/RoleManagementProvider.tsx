import { useCallback, useMemo, type ReactNode } from 'react';
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { getBrowserClient } from '../../lib/supabase/clients/browser';
import { createRoleManagementServices, type RoleManagementServices } from '../services';
import { RoleManagementContext } from '../contexts/RoleManagementContext';
import { roleQueryKeys } from '../query/queryKeys';
import { getRoleQueryClient } from '../query/queryClient';
import { invalidateUserRoleCache } from '../stores/roleCacheStore';
import { invalidatePermissionCache } from '../permissions/stores/permissionCacheStore';
import { useRoles as useAppRoles } from '../../context/RoleContext';
import { PermissionProvider } from '../permissions/providers/PermissionProvider';

let cachedServices: RoleManagementServices | null = null;

function getServices(): RoleManagementServices {
  if (!cachedServices) {
    cachedServices = createRoleManagementServices(getBrowserClient());
  }
  return cachedServices;
}

function RoleManagementInnerProvider({ children }: { children: ReactNode }) {
  const services = useMemo(() => getServices(), []);
  const appRoles = useAppRoles();
  const queryClient = useQueryClient();
  const userId = appRoles.profile?.id ?? null;

  const refreshRoles = useCallback(async () => {
    if (!userId) return;
    invalidateUserRoleCache(userId);
    invalidatePermissionCache(userId);
    services.roles.invalidateCache(userId);
    await queryClient.invalidateQueries({ queryKey: roleQueryKeys.currentUser(userId) });
    await queryClient.invalidateQueries({ queryKey: roleQueryKeys.permissions(userId) });
    await queryClient.invalidateQueries({ queryKey: roleQueryKeys.assignments(userId) });
    await queryClient.invalidateQueries({ queryKey: roleQueryKeys.assignmentHistory(userId) });
    await appRoles.refreshRoles();
  }, [userId, queryClient, services.roles, appRoles]);

  const value = useMemo(
    () => ({
      services,
      userId,
      refreshRoles,
    }),
    [services, userId, refreshRoles]
  );

  return (
    <RoleManagementContext.Provider value={value}>
      <PermissionProvider>{children}</PermissionProvider>
    </RoleManagementContext.Provider>
  );
}

export interface RoleManagementProviderProps {
  children: ReactNode;
}

export function RoleManagementProvider({ children }: RoleManagementProviderProps) {
  const queryClient = useMemo(() => getRoleQueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <RoleManagementInnerProvider>{children}</RoleManagementInnerProvider>
    </QueryClientProvider>
  );
}

export function resetRoleManagementServices(): void {
  cachedServices = null;
}
