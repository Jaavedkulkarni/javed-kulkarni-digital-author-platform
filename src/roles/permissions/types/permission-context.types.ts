import type { SystemRole } from '../../../types/roles';

/** Runtime permission context for resolver consumers. */
export interface PermissionContextSnapshot {
  assignedRoles: SystemRole[];
  effectiveRoles: SystemRole[];
  permissions: readonly string[];
  effectivePermissions: readonly string[];
  isLoading: boolean;
}

/** Options when constructing a permission resolver. */
export interface PermissionResolverOptions {
  roles: SystemRole[];
}
