import { useMemo } from 'react';
import { useRoles as useAuthRoles } from '../../../context/RoleContext';
import { createPermissionResolver } from '../services/permission-resolver.service';
import type { PermissionKey } from '../constants/permission.constants';
import type { PermissionState } from '../types/permission-state.types';

export interface FoundationPermissionsHook extends PermissionState {
  hasPermission: (permission: PermissionKey | string) => boolean;
  hasAnyPermission: (permissions: Array<PermissionKey | string>) => boolean;
  hasAllPermissions: (permissions: Array<PermissionKey | string>) => boolean;
}

/** Foundation hook — resolves permissions from the immutable registry for the current user. */
export function usePermissions(): FoundationPermissionsHook {
  const { roles, loading } = useAuthRoles();

  return useMemo(() => {
    const resolver = createPermissionResolver(roles);

    return {
      permissions: resolver.getPermissions(),
      effectivePermissions: resolver.getEffectivePermissions(),
      isLoading: loading,
      hasPermission: (permission) => resolver.hasPermission(permission),
      hasAnyPermission: (permissions) => resolver.hasAnyPermission(permissions),
      hasAllPermissions: (permissions) => resolver.hasAllPermissions(permissions),
    };
  }, [roles, loading]);
}
