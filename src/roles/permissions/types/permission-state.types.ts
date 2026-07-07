/** Reactive permission state exposed by foundation hooks. */
export interface PermissionState {
  permissions: readonly string[];
  effectivePermissions: readonly string[];
  isLoading: boolean;
}

/** Result shape for single-permission predicate hooks. */
export interface PermissionPredicateState {
  allowed: boolean;
  isLoading: boolean;
}

/** Result shape for capability helper hooks. */
export interface PermissionCapabilityState {
  can: boolean;
  cannot: boolean;
  isLoading: boolean;
}

/** Result shape for multi-permission predicate hooks. */
export interface MultiPermissionPredicateState {
  satisfied: boolean;
  isLoading: boolean;
}
