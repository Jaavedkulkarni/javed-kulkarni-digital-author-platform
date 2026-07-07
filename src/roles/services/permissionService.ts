import type { SystemRole } from '../../types/roles';
import {
  ALL_ROLE_PERMISSIONS,
  ROLE_PERMISSION_MATRIX,
  type PermissionCheckResult,
  type PermissionResource,
  type RolePermission,
} from '../types/permission.types';
import { buildActionPermission } from '../constants/actionPermissions';
import { isSuperAdmin as checkSuperAdmin } from '../../lib/permissions';

export class PermissionAuthorizationError extends Error {
  readonly status: 401 | 403;
  readonly code: 'UNAUTHENTICATED' | 'UNAUTHORIZED';

  constructor(status: 401 | 403, message: string) {
    super(message);
    this.name = 'PermissionAuthorizationError';
    this.status = status;
    this.code = status === 401 ? 'UNAUTHENTICATED' : 'UNAUTHORIZED';
  }
}

export class PermissionService {
  collectPermissions(roles: SystemRole[]): Set<RolePermission> {
    const permissions = new Set<RolePermission>();
    for (const role of roles) {
      for (const permission of ROLE_PERMISSION_MATRIX[role] ?? []) {
        permissions.add(permission);
      }
    }
    return permissions;
  }

  evaluate(roles: SystemRole[], permission: RolePermission): PermissionCheckResult {
    if (checkSuperAdmin(roles)) {
      return { allowed: true, permission, matchedRoles: ['super_admin'] };
    }

    const matchedRoles = roles.filter((role) =>
      (ROLE_PERMISSION_MATRIX[role] ?? []).includes(permission)
    );

    return {
      allowed: matchedRoles.length > 0,
      permission,
      matchedRoles,
    };
  }

  hasPermission(roles: SystemRole[], permission: RolePermission): boolean {
    return this.evaluate(roles, permission).allowed;
  }

  hasAnyPermission(roles: SystemRole[], permissions: RolePermission[]): boolean {
    return permissions.some((permission) => this.hasPermission(roles, permission));
  }

  hasAllPermissions(roles: SystemRole[], permissions: RolePermission[]): boolean {
    return permissions.every((permission) => this.hasPermission(roles, permission));
  }

  can(roles: SystemRole[], permission: RolePermission): boolean {
    return this.hasPermission(roles, permission);
  }

  cannot(roles: SystemRole[], permission: RolePermission): boolean {
    return !this.hasPermission(roles, permission);
  }

  canView(roles: SystemRole[], resource: PermissionResource): boolean {
    return this.hasPermission(roles, buildActionPermission(resource, 'view'));
  }

  canCreate(roles: SystemRole[], resource: PermissionResource): boolean {
    return this.hasPermission(roles, buildActionPermission(resource, 'create'));
  }

  canEdit(roles: SystemRole[], resource: PermissionResource): boolean {
    return this.hasPermission(roles, buildActionPermission(resource, 'edit'));
  }

  canDelete(roles: SystemRole[], resource: PermissionResource): boolean {
    return this.hasPermission(roles, buildActionPermission(resource, 'delete'));
  }

  canApprove(roles: SystemRole[], resource: PermissionResource): boolean {
    return this.hasPermission(roles, buildActionPermission(resource, 'approve'));
  }

  canReject(roles: SystemRole[], resource: PermissionResource): boolean {
    return this.hasPermission(roles, buildActionPermission(resource, 'reject'));
  }

  canPublish(roles: SystemRole[], resource: PermissionResource): boolean {
    return this.hasPermission(roles, buildActionPermission(resource, 'publish'));
  }

  canExport(roles: SystemRole[], resource: PermissionResource): boolean {
    return this.hasPermission(roles, buildActionPermission(resource, 'export'));
  }

  canImport(roles: SystemRole[], resource: PermissionResource): boolean {
    return this.hasPermission(roles, buildActionPermission(resource, 'import'));
  }

  canManage(roles: SystemRole[], resource: PermissionResource): boolean {
    return this.hasPermission(roles, buildActionPermission(resource, 'manage'));
  }

  assertAuthenticated(isAuthenticated: boolean): void {
    if (!isAuthenticated) {
      throw new PermissionAuthorizationError(401, 'Authentication required.');
    }
  }

  assertPermission(roles: SystemRole[], permission: RolePermission, isAuthenticated = true): void {
    this.assertAuthenticated(isAuthenticated);
    if (!this.hasPermission(roles, permission)) {
      throw new PermissionAuthorizationError(403, 'Insufficient permissions.');
    }
  }

  assertAnyPermission(
    roles: SystemRole[],
    permissions: RolePermission[],
    isAuthenticated = true
  ): void {
    this.assertAuthenticated(isAuthenticated);
    if (!this.hasAnyPermission(roles, permissions)) {
      throw new PermissionAuthorizationError(403, 'Insufficient permissions.');
    }
  }

  listPermissionsForRole(role: SystemRole): RolePermission[] {
    return [...(ROLE_PERMISSION_MATRIX[role] ?? [])];
  }

  listAllPermissions(): RolePermission[] {
    return [...ALL_ROLE_PERMISSIONS];
  }
}

export function createPermissionService(): PermissionService {
  return new PermissionService();
}
