import { useMemo } from 'react';
import { useRoles as useAuthRoles } from '../../../context/RoleContext';
import { createPermissionResolver } from '../services/permission-resolver.service';
import type { PermissionKey } from '../constants/permission.constants';

/** Capability helpers derived from the permission registry. */
export function useCan() {
  const { roles, loading } = useAuthRoles();

  return useMemo(() => {
    const resolver = createPermissionResolver(roles);

    return {
      can: (permission: PermissionKey | string) => resolver.hasPermission(permission),
      canAny: (permissions: Array<PermissionKey | string>) => resolver.hasAnyPermission(permissions),
      canAll: (permissions: Array<PermissionKey | string>) => resolver.hasAllPermissions(permissions),
      isLoading: loading,
    };
  }, [roles, loading]);
}
