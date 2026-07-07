import type { SystemRole } from '../../types/roles';

/** Runtime role context for resolver and hook consumers. */
export interface RoleContextSnapshot {
  assignedRoles: SystemRole[];
  effectiveRoles: SystemRole[];
  highestRole: SystemRole | null;
  isLoading: boolean;
}

/** Options passed when constructing a role resolver instance. */
export interface RoleResolverOptions {
  assignedRoles: SystemRole[];
}
