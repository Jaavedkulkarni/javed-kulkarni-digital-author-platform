import { useMemo } from 'react';
import { useRoles as useAuthRoles } from '../../../context/RoleContext';
import { createPermissionResolver } from '../services/permission-resolver.service';
import type { PermissionKey } from '../constants/permission.constants';
import type { PermissionPredicateState } from '../types/permission-state.types';

/** Returns whether the current user has a specific registry permission. */
export function usePermission(permission: PermissionKey | string): PermissionPredicateState {
  const { roles, loading } = useAuthRoles();

  return useMemo(() => {
    const resolver = createPermissionResolver(roles);
    return {
      allowed: resolver.hasPermission(permission),
      isLoading: loading,
    };
  }, [roles, loading, permission]);
}
