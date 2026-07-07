import { useMemo } from 'react';
import { useRoles as useAuthRoles } from '../../context/RoleContext';
import { createRoleResolver } from '../services/role-resolver.service';
import type { SystemRole } from '../../types/roles';
import type { RolePredicateState } from '../types/role-state.types';

/** Returns whether the current user effectively has a specific role. */
export function useHasRole(role: SystemRole): RolePredicateState {
  const { roles, loading } = useAuthRoles();

  return useMemo(() => {
    const resolver = createRoleResolver(roles);
    return {
      hasRole: resolver.hasRole(role),
      isLoading: loading,
    };
  }, [roles, loading, role]);
}
