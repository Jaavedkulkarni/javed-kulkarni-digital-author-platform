import { useMemo } from 'react';
import { useRoles as useAuthRoles } from '../../context/RoleContext';
import { createRoleResolver } from '../services/role-resolver.service';
import { roleRegistryService } from '../services/role-registry.service';
import type { RoleState } from '../types/role-state.types';

/** Foundation hook — resolves assigned and effective roles for the current user. */
export function useRoles(): RoleState {
  const { roles, loading, primaryRole } = useAuthRoles();

  return useMemo(() => {
    const resolver = createRoleResolver(roles);
    const effectiveRoles = resolver.getEffectiveRoles();
    const highestRole = resolver.getHighestRole();

    return {
      assignedRoles: resolver.getRoles(),
      effectiveRoles,
      highestRole,
      currentRole: highestRole ?? primaryRole,
      definitions: effectiveRoles
        .map((role) => roleRegistryService.findRole(role))
        .filter((definition): definition is NonNullable<typeof definition> => Boolean(definition)),
      isLoading: loading,
    };
  }, [roles, loading, primaryRole]);
}
