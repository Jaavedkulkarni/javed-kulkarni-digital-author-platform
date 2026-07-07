import type { SystemRole } from '../../types/roles';

/**
 * Locked AuthorOS role priority — highest authority first.
 * Super Admin → Platform Admin → Author → Reader → Publisher
 */
export const REGISTRY_ROLE_PRIORITY: readonly SystemRole[] = [
  'super_admin',
  'admin',
  'author',
  'reader',
  'publisher',
] as const;

/** Numeric priority — lower value means higher authority. */
export const REGISTRY_ROLE_PRIORITY_RANK: Readonly<Record<SystemRole, number>> = {
  super_admin: 1,
  admin: 2,
  author: 3,
  reader: 4,
  publisher: 5,
};

export function compareRolePriority(a: SystemRole, b: SystemRole): number {
  return REGISTRY_ROLE_PRIORITY_RANK[a] - REGISTRY_ROLE_PRIORITY_RANK[b];
}

export function sortRolesByPriority(roles: SystemRole[]): SystemRole[] {
  return [...roles].sort(compareRolePriority);
}

export function getHighestPriorityRole(roles: SystemRole[]): SystemRole | null {
  if (roles.length === 0) return null;
  return sortRolesByPriority(roles)[0];
}
