import { useMemo } from 'react';
import { useRoles as useAuthRoles } from '../../../context/RoleContext';
import { createPermissionResolver } from '../services/permission-resolver.service';
import type { PermissionKey } from '../constants/permission.constants';
import type { MultiPermissionPredicateState } from '../types/permission-state.types';

interface UseHasPermissionOptions {
  mode?: 'any' | 'all';
}

/** Returns whether the current user satisfies one or more registry permissions. */
export function useHasPermission(
  permissions: PermissionKey | string | Array<PermissionKey | string>,
  options: UseHasPermissionOptions = {},
): MultiPermissionPredicateState {
  const { roles, loading } = useAuthRoles();
  const mode = options.mode ?? 'any';

  return useMemo(() => {
    const resolver = createPermissionResolver(roles);
    const required = Array.isArray(permissions) ? permissions : [permissions];
    const satisfied =
      mode === 'all'
        ? resolver.hasAllPermissions(required)
        : resolver.hasAnyPermission(required);

    return {
      satisfied,
      isLoading: loading,
    };
  }, [roles, loading, permissions, mode]);
}
