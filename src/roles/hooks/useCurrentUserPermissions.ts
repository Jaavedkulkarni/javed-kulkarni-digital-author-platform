import { useMemo } from 'react';
import type { RolePermission } from '../types/permission.types';
import { useCurrentUserRoles, useRoleManagementContext } from './useCurrentUserRoles';

export function useCurrentUserPermissions() {
  const { roles, isLoading, isFetching, error, refreshRoles } = useCurrentUserRoles();
  const { services } = useRoleManagementContext();

  return useMemo(
    () => ({
      roles,
      permissions: services.permissions.collectPermissions(roles),
      isLoading,
      isFetching,
      error,
      refreshRoles,
      hasPermission: (permission: RolePermission) => services.permissions.hasPermission(roles, permission),
      hasAnyPermission: (permissions: RolePermission[]) =>
        services.permissions.hasAnyPermission(roles, permissions),
      hasAllPermissions: (permissions: RolePermission[]) =>
        services.permissions.hasAllPermissions(roles, permissions),
      evaluate: (permission: RolePermission) => services.permissions.evaluate(roles, permission),
    }),
    [services.permissions, roles, isLoading, isFetching, error, refreshRoles]
  );
}

export type CurrentUserPermissionsHook = ReturnType<typeof useCurrentUserPermissions>;
