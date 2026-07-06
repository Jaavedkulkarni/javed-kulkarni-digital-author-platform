import type {
  CorePermission,
  CoreRole,
  PermissionCheckContext,
  PermissionCheckResult,
  PermissionGroup,
} from '../types/permission.types';
import { getPermissionsForGroup } from './permissionGroups';
import { getPermissionsForRoles } from './rolePermissions';

export class PermissionEngine {
  private roleOverrides: Map<CoreRole, Set<CorePermission>> = new Map();

  getGrantedPermissions(roles: CoreRole[]): CorePermission[] {
    const granted = getPermissionsForRoles(roles);
    for (const role of roles) {
      const overrides = this.roleOverrides.get(role);
      if (overrides) {
        for (const permission of overrides) {
          if (!granted.includes(permission)) {
            granted.push(permission);
          }
        }
      }
    }
    return granted;
  }

  hasPermission(roles: CoreRole[], permission: CorePermission): boolean {
    return this.getGrantedPermissions(roles).includes(permission);
  }

  hasAnyPermission(roles: CoreRole[], permissions: CorePermission[]): boolean {
    const granted = new Set(this.getGrantedPermissions(roles));
    return permissions.some((permission) => granted.has(permission));
  }

  hasAllPermissions(roles: CoreRole[], permissions: CorePermission[]): boolean {
    const granted = new Set(this.getGrantedPermissions(roles));
    return permissions.every((permission) => granted.has(permission));
  }

  hasGroupAccess(roles: CoreRole[], group: PermissionGroup): boolean {
    const groupPermissions = getPermissionsForGroup(group);
    return this.hasAnyPermission(roles, [...groupPermissions]);
  }

  check(context: PermissionCheckContext): PermissionCheckResult {
    const allowed = this.evaluate(context);
    return {
      allowed,
      roles: context.roles,
      permission: context.permission,
      reason: allowed ? undefined : `Role set lacks permission "${context.permission}".`,
    };
  }

  evaluate(context: PermissionCheckContext): boolean {
    if (!this.hasPermission(context.roles, context.permission)) {
      return false;
    }

    if (
      context.permission === 'books:manage_own' &&
      context.resourceOwnerId &&
      context.actorId &&
      context.resourceOwnerId !== context.actorId
    ) {
      return this.hasPermission(context.roles, 'books:manage_all');
    }

    return true;
  }

  grantRolePermission(role: CoreRole, permission: CorePermission): void {
    const existing = this.roleOverrides.get(role) ?? new Set<CorePermission>();
    existing.add(permission);
    this.roleOverrides.set(role, existing);
  }

  revokeRolePermission(role: CoreRole, permission: CorePermission): void {
    const existing = this.roleOverrides.get(role);
    if (!existing) return;
    existing.delete(permission);
    if (existing.size === 0) {
      this.roleOverrides.delete(role);
    } else {
      this.roleOverrides.set(role, existing);
    }
  }
}

let permissionEngineInstance: PermissionEngine | null = null;

export function getPermissionEngine(): PermissionEngine {
  if (!permissionEngineInstance) {
    permissionEngineInstance = new PermissionEngine();
  }
  return permissionEngineInstance;
}

export function resetPermissionEngine(): void {
  permissionEngineInstance = null;
}

export function createPermissionEngine(): PermissionEngine {
  return new PermissionEngine();
}
