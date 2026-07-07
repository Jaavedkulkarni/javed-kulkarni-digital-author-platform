import { useMemo } from 'react';
import { useRoles as useAuthRoles } from '../../context/RoleContext';
import { createRoleResolver } from '../services/role-resolver.service';
import type { SystemRole } from '../../types/roles';
import type { MultiRolePredicateState } from '../types/role-state.types';

/** Returns whether the current user has all of the required roles. */
export function useHasAllRoles(requiredRoles: SystemRole[]): MultiRolePredicateState {
  const { roles, loading } = useAuthRoles();

  return useMemo(() => {
    const resolver = createRoleResolver(roles);
    return {
      satisfied: resolver.hasAllRoles(requiredRoles),
      isLoading: loading,
    };
  }, [roles, loading, requiredRoles]);
}
