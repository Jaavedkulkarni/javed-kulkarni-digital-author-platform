import type { SystemRole } from '../../types/roles';
import { getHighestPriorityRole, sortRolesByPriority } from '../constants/role-priority';
import { getRegistryRole, ROLE_REGISTRY_MAP } from '../registry/role.registry';
import type { RoleResolverOptions } from '../types/role-context.types';

function collectInheritedRoles(role: SystemRole, visited = new Set<SystemRole>()): SystemRole[] {
  if (visited.has(role)) return [];
  visited.add(role);

  const definition = ROLE_REGISTRY_MAP[role];
  if (!definition) return [];

  const inherited: SystemRole[] = [];
  for (const parent of definition.inherits) {
    inherited.push(parent);
    inherited.push(...collectInheritedRoles(parent, visited));
  }

  return inherited;
}

/** Resolves assigned roles into effective capabilities per the locked business model. */
export class RoleResolver {
  private readonly assignedRoles: SystemRole[];

  constructor(options: RoleResolverOptions | SystemRole[]) {
    this.assignedRoles = Array.isArray(options) ? [...options] : [...options.assignedRoles];
  }

  getRoles(): SystemRole[] {
    return [...this.assignedRoles];
  }

  getHighestRole(): SystemRole | null {
    return getHighestPriorityRole(this.getEffectiveRoles());
  }

  getInheritedRoles(role: SystemRole): SystemRole[] {
    const inherited = collectInheritedRoles(role);
    return sortRolesByPriority([...new Set(inherited)]);
  }

  getEffectiveRoles(): SystemRole[] {
    const effective = new Set<SystemRole>();

    for (const role of this.assignedRoles) {
      effective.add(role);
      for (const inherited of this.getInheritedRoles(role)) {
        effective.add(inherited);
      }
    }

    return sortRolesByPriority([...effective]);
  }

  isReader(): boolean {
    return this.getEffectiveRoles().includes('reader');
  }

  isAuthor(): boolean {
    return this.assignedRoles.includes('author');
  }

  isPublisher(): boolean {
    return this.assignedRoles.includes('publisher');
  }

  isPlatformAdmin(): boolean {
    return this.assignedRoles.includes('admin');
  }

  isSuperAdmin(): boolean {
    return this.assignedRoles.includes('super_admin');
  }

  hasRole(role: SystemRole): boolean {
    return this.getEffectiveRoles().includes(role);
  }

  hasAnyRole(required: SystemRole[]): boolean {
    const effective = new Set(this.getEffectiveRoles());
    return required.some((role) => effective.has(role));
  }

  hasAllRoles(required: SystemRole[]): boolean {
    const effective = new Set(this.getEffectiveRoles());
    return required.every((role) => effective.has(role));
  }

  getRoleDefinition(role: SystemRole) {
    return getRegistryRole(role);
  }
}

export function createRoleResolver(assignedRoles: SystemRole[]): RoleResolver {
  return new RoleResolver(assignedRoles);
}

export { collectInheritedRoles };
