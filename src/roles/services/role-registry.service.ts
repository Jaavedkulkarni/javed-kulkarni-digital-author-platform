import type { SystemRole } from '../../types/roles';
import { ROLE_REGISTRY_LIST, ROLE_REGISTRY_MAP } from '../registry/role.registry';
import type { RoleDefinition } from '../types/role-registry.types';

/** Read-only access to the centralized AuthorOS role registry. */
export class RoleRegistryService {
  findRole(id: SystemRole): Readonly<RoleDefinition> | undefined {
    return ROLE_REGISTRY_MAP[id];
  }

  findBySlug(slug: string): Readonly<RoleDefinition> | undefined {
    return ROLE_REGISTRY_LIST.find((role) => role.slug === slug);
  }

  getAllRoles(): readonly Readonly<RoleDefinition>[] {
    return ROLE_REGISTRY_LIST;
  }

  getAssignableRoles(): readonly Readonly<RoleDefinition>[] {
    return ROLE_REGISTRY_LIST.filter((role) => role.isAssignable && role.isActive);
  }

  getSystemRoles(): readonly Readonly<RoleDefinition>[] {
    return ROLE_REGISTRY_LIST.filter((role) => role.isSystem && role.isActive);
  }

  getActiveRoles(): readonly Readonly<RoleDefinition>[] {
    return ROLE_REGISTRY_LIST.filter((role) => role.isActive);
  }
}

export const roleRegistryService = new RoleRegistryService();

export function createRoleRegistryService(): RoleRegistryService {
  return roleRegistryService;
}
