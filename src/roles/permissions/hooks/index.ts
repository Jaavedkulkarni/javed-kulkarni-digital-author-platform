export { usePermissions } from './usePermissions';
export type { FoundationPermissionsHook } from './usePermissions';
export { usePermission } from './usePermission';
export { useCan } from './useCan';
export { useCannot } from './useCannot';
export { useHasPermission } from './useHasPermission';

export {
  usePermissionContextState,
  usePermissions as usePermissionProviderState,
  usePermission as useContextPermission,
  useCan as useContextCan,
  useRole,
  usePermissionRoles,
} from './usePermissionContextHooks';
