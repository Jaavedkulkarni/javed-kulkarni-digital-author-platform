import type { PermissionAction, PermissionResource, RolePermission } from '../types/permission.types';

const ACTION_SUFFIX: Record<PermissionAction, string> = {
  view: 'view',
  create: 'create',
  edit: 'edit',
  delete: 'delete',
  approve: 'approve',
  reject: 'reject',
  publish: 'publish',
  export: 'export',
  import: 'import',
  manage: 'manage',
};

export function buildActionPermission(
  resource: PermissionResource,
  action: PermissionAction
): RolePermission {
  return `${resource}.${ACTION_SUFFIX[action]}` as RolePermission;
}

export const ACTION_PERMISSION_BUILDERS = {
  view: (resource: PermissionResource) => buildActionPermission(resource, 'view'),
  create: (resource: PermissionResource) => buildActionPermission(resource, 'create'),
  edit: (resource: PermissionResource) => buildActionPermission(resource, 'edit'),
  delete: (resource: PermissionResource) => buildActionPermission(resource, 'delete'),
  approve: (resource: PermissionResource) => buildActionPermission(resource, 'approve'),
  reject: (resource: PermissionResource) => buildActionPermission(resource, 'reject'),
  publish: (resource: PermissionResource) => buildActionPermission(resource, 'publish'),
  export: (resource: PermissionResource) => buildActionPermission(resource, 'export'),
  import: (resource: PermissionResource) => buildActionPermission(resource, 'import'),
  manage: (resource: PermissionResource) => buildActionPermission(resource, 'manage'),
} as const;
