import type { SystemRole } from '../../types/roles';

/** Canonical definition of a system role in the AuthorOS registry. */
export interface RoleDefinition {
  id: SystemRole;
  name: string;
  slug: string;
  description: string;
  priority: number;
  inherits: readonly SystemRole[];
  isSystem: boolean;
  isAssignable: boolean;
  isActive: boolean;
}

/** Immutable centralized role registry map keyed by system role id. */
export type RoleRegistryMap = Readonly<Record<SystemRole, Readonly<RoleDefinition>>>;

/** Full role registry envelope with metadata. */
export interface RoleRegistry {
  version: string;
  roles: RoleRegistryMap;
}

/** Result of a role validation operation. */
export interface RoleValidationResult {
  valid: boolean;
  errors: string[];
}

/** Input for assignment validation against the locked business model. */
export interface RoleAssignmentValidationInput {
  currentRoles: SystemRole[];
  role: SystemRole;
}
