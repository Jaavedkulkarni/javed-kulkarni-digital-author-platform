import type { SystemRole } from '../../../types/roles';
import { PERMISSION_GROUPS } from '../constants/permission-groups';
import { PERMISSION_REGISTRY, PERMISSION_REGISTRY_LIST } from '../registry/permission.registry';
import type { PermissionDefinition } from '../types/permission-registry.types';
import type { PermissionGroup } from '../types/permission.types';

/** Read-only access to the centralized AuthorOS permission registry. */
export class PermissionRegistryService {
  findByKey(key: string): Readonly<PermissionDefinition> | undefined {
    return PERMISSION_REGISTRY.permissions[key];
  }

  findById(id: string): Readonly<PermissionDefinition> | undefined {
    return PERMISSION_REGISTRY_LIST.find((permission) => permission.id === id);
  }

  getAllPermissions(): readonly Readonly<PermissionDefinition>[] {
    return PERMISSION_REGISTRY_LIST;
  }

  getActivePermissions(): readonly Readonly<PermissionDefinition>[] {
    return PERMISSION_REGISTRY_LIST.filter((permission) => permission.isActive);
  }

  getSystemPermissions(): readonly Readonly<PermissionDefinition>[] {
    return PERMISSION_REGISTRY_LIST.filter((permission) => permission.isSystem && permission.isActive);
  }

  getPermissionsByGroup(group: PermissionGroup): readonly Readonly<PermissionDefinition>[] {
    return PERMISSION_REGISTRY_LIST.filter((permission) => permission.group === group);
  }

  getPermissionsByModule(module: PermissionDefinition['module']): readonly Readonly<PermissionDefinition>[] {
    return PERMISSION_REGISTRY_LIST.filter((permission) => permission.module === module);
  }

  getPermissionGroups(): readonly PermissionGroup[] {
    return PERMISSION_GROUPS;
  }

  getKeysForRole(role: SystemRole): readonly string[] {
    return PERMISSION_REGISTRY.keys.filter((key) => {
      const permission = PERMISSION_REGISTRY.permissions[key];
      if (!permission) return false;
      if (role === 'super_admin') return true;
      if (role === 'admin') return permission.module === 'platform';
      if (role === 'author') return permission.module === 'author';
      if (role === 'reader') return permission.module === 'reader';
      if (role === 'publisher') return permission.module === 'publisher';
      return false;
    });
  }
}

export const permissionRegistryService = new PermissionRegistryService();

export function createPermissionRegistryService(): PermissionRegistryService {
  return permissionRegistryService;
}
