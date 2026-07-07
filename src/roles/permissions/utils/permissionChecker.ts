import type { SystemRole } from '../../types/roles';
import type { PermissionService, PermissionAuthorizationError } from '../../services/permissionService';
import type { RolePermission } from '../../types/permission.types';
import type { PermissionChecker } from '../types/guard.types';

export function createPermissionChecker(
  service: PermissionService,
  roles: SystemRole[]
): PermissionChecker {
  return {
    can: (permission) => service.can(roles, permission),
    cannot: (permission) => service.cannot(roles, permission),
    hasPermission: (permission) => service.hasPermission(roles, permission),
    hasAnyPermission: (permissions) => service.hasAnyPermission(roles, permissions),
    hasAllPermissions: (permissions) => service.hasAllPermissions(roles, permissions),
    canView: (resource) => service.canView(roles, resource),
    canCreate: (resource) => service.canCreate(roles, resource),
    canEdit: (resource) => service.canEdit(roles, resource),
    canDelete: (resource) => service.canDelete(roles, resource),
    canApprove: (resource) => service.canApprove(roles, resource),
    canReject: (resource) => service.canReject(roles, resource),
    canPublish: (resource) => service.canPublish(roles, resource),
    canExport: (resource) => service.canExport(roles, resource),
    canImport: (resource) => service.canImport(roles, resource),
    canManage: (resource) => service.canManage(roles, resource),
  };
}

export function evaluateRequirement(
  checker: PermissionChecker,
  permissions: RolePermission[],
  mode: 'all' | 'any' = 'any'
): boolean {
  if (permissions.length === 0) return true;
  return mode === 'all'
    ? checker.hasAllPermissions(permissions)
    : checker.hasAnyPermission(permissions);
}

export async function assertApiPermission(
  service: PermissionService,
  roles: SystemRole[],
  permission: RolePermission,
  isAuthenticated: boolean
): Promise<void> {
  service.assertPermission(roles, permission, isAuthenticated);
}

export function mapAuthorizationError(error: unknown): PermissionAuthorizationError | null {
  if (error instanceof PermissionAuthorizationError) return error;
  return null;
}
