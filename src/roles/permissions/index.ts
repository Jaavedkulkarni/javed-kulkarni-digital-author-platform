export * from './types';
export * from './constants';
export * from './registry';
export * from './services';
export * from './hooks';

export * from './types/guard.types';
export * from './contexts/PermissionContext';
export { PermissionProvider, usePermissionContext } from './providers/PermissionProvider';

export {
  usePermissionContextState,
  usePermissionProviderState,
  useContextPermission,
  useContextCan,
  useRole,
  usePermissionRoles,
} from './hooks/usePermissionContextHooks';

export * from './guards/PermissionGuard';
export * from './guards/FeatureGuard';
export * from './guards/PageGuard';
export * from './guards/RouteGuard';
export * from './guards/ActionGuard';
export * from './guards/RoleGuard';
export * from './components/Unauthorized';
export * from './components/Forbidden';
export * from './components/PermissionSkeleton';
export * from './components/ConditionalPermission';
export * from './components/PermissionButton';
export * from './components/PermissionForm';
export * from './components/PermissionTable';
export * from './utils/permissionChecker';
export * from './utils/permissionApiGuard';
export * from './validation/permissionMatrixValidation';

/** @deprecated Legacy permission keys — prefer PERMISSION_KEYS from the registry foundation. */
export {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  ALL_ROLE_PERMISSIONS,
  ROLE_PERMISSION_MATRIX,
  type RolePermission,
  type PermissionCheckResult,
  type PermissionResource,
} from '../types/permission.types';

export {
  PAGE_PERMISSIONS,
  FEATURE_PERMISSIONS,
  ROUTE_PERMISSIONS,
  type PagePermissionKey,
  type FeaturePermissionKey,
  type RoutePermissionKey,
} from '../constants/pagePermissions';

export { buildActionPermission, ACTION_PERMISSION_BUILDERS } from '../constants/actionPermissions';

export {
  PERMISSION_REGISTRY,
  PERMISSION_REGISTRY_LIST,
  ROLE_PERMISSION_MAP,
  PERMISSION_KEYS,
  ALL_PERMISSION_KEYS,
  getRegistryPermission,
} from './registry/permission.registry';

export {
  PermissionRegistryService,
  permissionRegistryService,
  createPermissionRegistryService,
  PermissionResolverService,
  createPermissionResolver,
  PermissionValidatorService,
  permissionValidatorService,
  createPermissionValidatorService,
} from './services';

export type { PermissionKey } from './constants/permission.constants';
