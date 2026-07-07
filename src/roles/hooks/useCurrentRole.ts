import { useMemo } from 'react';
import { useRoles as useAuthRoles } from '../../context/RoleContext';
import { createRoleResolver } from '../services/role-resolver.service';
import { getRegistryRole } from '../registry/role.registry';
import type { SystemRole } from '../../types/roles';

/** Returns the highest-priority active role for the current user. */
export function useCurrentRole() {
  const { roles, loading, primaryRole } = useAuthRoles();

  return useMemo(() => {
    const resolver = createRoleResolver(roles);
    const currentRole = resolver.getHighestRole() ?? primaryRole;
    const definition = currentRole ? getRegistryRole(currentRole) : null;

    return {
      currentRole,
      definition,
      isLoading: loading,
    };
  }, [roles, loading, primaryRole]);
}

export type CurrentRoleHook = ReturnType<typeof useCurrentRole>;

export type { SystemRole };
