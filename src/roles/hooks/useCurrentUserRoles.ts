import { useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { SystemRole } from '../../types/roles';
import { RoleManagementContext } from '../contexts/RoleManagementContext';
import { roleQueryKeys } from '../query/queryKeys';
import { getBrowserClient } from '../../lib/supabase/clients/browser';
import { createRoleManagementServices } from '../services';
import type { CurrentUserRoleSnapshot, UserRoleAssignment } from '../types/role.types';

let fallbackServices: ReturnType<typeof createRoleManagementServices> | null = null;

function useRoleManagementContext() {
  const ctx = useContext(RoleManagementContext);
  if (ctx) return ctx;

  if (!fallbackServices) {
    fallbackServices = createRoleManagementServices(getBrowserClient());
  }

  return {
    services: fallbackServices,
    userId: null as string | null,
    refreshRoles: async () => {},
  };
}

export function useCurrentUserRoles() {
  const { services, userId, refreshRoles } = useRoleManagementContext();

  const query = useQuery({
    queryKey: roleQueryKeys.currentUser(userId ?? 'guest'),
    queryFn: () => services.roles.getCurrentUserRoles(false),
    enabled: Boolean(userId),
  });

  return useMemo(() => {
    const roles = query.data?.roles ?? [];
    const assignments = query.data?.assignments ?? [];

    return {
      userId,
      roles,
      assignments,
      snapshot: query.data ?? null,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      error: query.error,
      refreshRoles,
      hasRole: (role: SystemRole) => services.roles.hasRole(roles, role),
      hasAnyRole: (required: SystemRole[]) => services.roles.hasAnyRole(roles, required),
      hasAllRoles: (required: SystemRole[]) => services.roles.hasAllRoles(roles, required),
      isReader: () => services.roles.isReader(roles),
      isAuthor: () => services.roles.isAuthor(roles),
      isPublisher: () => services.roles.isPublisher(roles),
      isPlatformAdmin: () => services.roles.isPlatformAdmin(roles),
      isSuperAdmin: () => services.roles.isSuperAdmin(roles),
      assignRole: async (targetUserId: string, role: SystemRole, assignedBy: string) => {
        const result = await services.roles.assignRole({ userId: targetUserId, role, assignedBy });
        if (result.success) await refreshRoles();
        return result;
      },
      removeRole: async (targetUserId: string, role: SystemRole, actorId: string) => {
        const result = await services.roles.removeRole({ userId: targetUserId, role, actorId });
        if (result.success) await refreshRoles();
        return result;
      },
    };
  }, [
    services.roles,
    userId,
    query.data,
    query.isLoading,
    query.isFetching,
    query.error,
    refreshRoles,
  ]);
}

export type CurrentUserRolesHook = ReturnType<typeof useCurrentUserRoles>;
export type { CurrentUserRoleSnapshot, UserRoleAssignment };

export { useRoleManagementContext };
