import type { SystemRole } from '../../../types/roles';
import { createRoleResolver } from '../../services/role-resolver.service';
import { ROLE_PERMISSION_MAP } from '../registry/permission.registry';
import type { PermissionResolverOptions } from '../types/permission-context.types';

function collectPermissionsForRoles(roles: SystemRole[]): string[] {
  const permissions = new Set<string>();

  for (const role of roles) {
    for (const permission of ROLE_PERMISSION_MAP[role] ?? []) {
      permissions.add(permission);
    }
  }

  return [...permissions].sort();
}

/** Resolves assigned roles into effective permission sets. */
export class PermissionResolverService {
  private readonly assignedRoles: SystemRole[];

  constructor(options: PermissionResolverOptions | SystemRole[]) {
    this.assignedRoles = Array.isArray(options) ? [...options] : [...options.roles];
  }

  getRoles(): SystemRole[] {
    return [...this.assignedRoles];
  }

  getPermissions(): string[] {
    return collectPermissionsForRoles(this.assignedRoles);
  }

  getEffectivePermissions(): string[] {
    const roleResolver = createRoleResolver(this.assignedRoles);
    return collectPermissionsForRoles(roleResolver.getEffectiveRoles());
  }

  hasPermission(permission: string): boolean {
    return this.getEffectivePermissions().includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    const effective = new Set(this.getEffectivePermissions());
    return permissions.some((permission) => effective.has(permission));
  }

  hasAllPermissions(permissions: string[]): boolean {
    const effective = new Set(this.getEffectivePermissions());
    return permissions.every((permission) => effective.has(permission));
  }
}

export function createPermissionResolver(roles: SystemRole[]): PermissionResolverService {
  return new PermissionResolverService(roles);
}

export { collectPermissionsForRoles };
