import type { SystemRole } from '../../types/roles';
import type { RoleDefinition } from './role-registry.types';

/** Reactive role state exposed by foundation hooks. */
export interface RoleState {
  assignedRoles: SystemRole[];
  effectiveRoles: SystemRole[];
  highestRole: SystemRole | null;
  currentRole: SystemRole | null;
  definitions: RoleDefinition[];
  isLoading: boolean;
}

/** Result shape for single-role predicate hooks. */
export interface RolePredicateState {
  hasRole: boolean;
  isLoading: boolean;
}

/** Result shape for multi-role predicate hooks. */
export interface MultiRolePredicateState {
  satisfied: boolean;
  isLoading: boolean;
}
