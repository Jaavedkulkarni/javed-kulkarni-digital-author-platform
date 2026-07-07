import { useMemo } from 'react';
import { useRoles as useAuthRoles } from '../../../context/RoleContext';
import { createPermissionResolver } from '../services/permission-resolver.service';
import type { PermissionKey } from '../constants/permission.constants';
import type { PermissionCapabilityState } from '../types/permission-state.types';

/** Returns negated permission capability for a single registry permission. */
export function useCannot(permission: PermissionKey | string): PermissionCapabilityState {
  const { roles, loading } = useAuthRoles();

  return useMemo(() => {
    const resolver = createPermissionResolver(roles);
    const can = resolver.hasPermission(permission);
    return {
      can,
      cannot: !can,
      isLoading: loading,
    };
  }, [roles, loading, permission]);
}
