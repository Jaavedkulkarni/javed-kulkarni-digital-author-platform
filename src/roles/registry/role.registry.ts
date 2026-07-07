import type { SystemRole } from '../../types/roles';
import { REGISTRY_ROLE_PRIORITY_RANK } from '../constants/role-priority';
import type { RoleDefinition, RoleRegistry, RoleRegistryMap } from '../types/role-registry.types';

function defineRole(definition: RoleDefinition): Readonly<RoleDefinition> {
  return Object.freeze(definition);
}

const READER_ROLE = defineRole({
  id: 'reader',
  name: 'Reader',
  slug: 'reader',
  description: 'Base role for every AuthorOS identity. Enables reading, library, and commerce.',
  priority: REGISTRY_ROLE_PRIORITY_RANK.reader,
  inherits: [],
  isSystem: true,
  isAssignable: false,
  isActive: true,
});

const AUTHOR_ROLE = defineRole({
  id: 'author',
  name: 'Author',
  slug: 'author',
  description: 'Content creator role. Inherits Reader capabilities.',
  priority: REGISTRY_ROLE_PRIORITY_RANK.author,
  inherits: ['reader'],
  isSystem: true,
  isAssignable: true,
  isActive: true,
});

const PUBLISHER_ROLE = defineRole({
  id: 'publisher',
  name: 'Publisher',
  slug: 'publisher',
  description: 'Independent printing and fulfillment role. Does not inherit Reader.',
  priority: REGISTRY_ROLE_PRIORITY_RANK.publisher,
  inherits: [],
  isSystem: true,
  isAssignable: true,
  isActive: true,
});

const PLATFORM_ADMIN_ROLE = defineRole({
  id: 'admin',
  name: 'Platform Admin',
  slug: 'platform-admin',
  description: 'Operational platform administrator. Inherits Reader capabilities.',
  priority: REGISTRY_ROLE_PRIORITY_RANK.admin,
  inherits: ['reader'],
  isSystem: true,
  isAssignable: true,
  isActive: true,
});

const SUPER_ADMIN_ROLE = defineRole({
  id: 'super_admin',
  name: 'Super Admin',
  slug: 'super-admin',
  description: 'Full platform control. Inherits Reader capabilities.',
  priority: REGISTRY_ROLE_PRIORITY_RANK.super_admin,
  inherits: ['reader'],
  isSystem: true,
  isAssignable: true,
  isActive: true,
});

const REGISTRY_ENTRIES: Record<SystemRole, Readonly<RoleDefinition>> = {
  reader: READER_ROLE,
  author: AUTHOR_ROLE,
  publisher: PUBLISHER_ROLE,
  admin: PLATFORM_ADMIN_ROLE,
  super_admin: SUPER_ADMIN_ROLE,
};

/** Centralized immutable AuthorOS role registry. */
export const ROLE_REGISTRY_MAP: RoleRegistryMap = Object.freeze(REGISTRY_ENTRIES);

export const ROLE_REGISTRY: RoleRegistry = Object.freeze({
  version: '1.0.0',
  roles: ROLE_REGISTRY_MAP,
});

export const ROLE_REGISTRY_LIST: readonly Readonly<RoleDefinition>[] = Object.freeze(
  (Object.keys(REGISTRY_ENTRIES) as SystemRole[]).map((key) => REGISTRY_ENTRIES[key]),
);

export function getRegistryRole(role: SystemRole): Readonly<RoleDefinition> {
  return ROLE_REGISTRY_MAP[role];
}
