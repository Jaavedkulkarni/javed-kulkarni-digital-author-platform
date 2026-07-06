import type { PermissionGroup } from '../../core/types/permission.types';
import { PERMISSION_GROUPS } from '../../core/permissions/permissionGroups';

export const ORGANIZATION_PERMISSION_GROUPS = [
  { id: 'organization' as const, label: 'Organization', permissions: ['org:view', 'org:manage', 'org:members:view', 'org:members:invite', 'org:settings'] },
  { id: 'workspace' as const, label: 'Workspace', permissions: ['workspace:switch'] },
  { id: 'publisher' as const, label: 'Publisher', permissions: ['feature:publisher_dashboard'] },
  { id: 'author' as const, label: 'Author', permissions: ['feature:author_dashboard'] },
];

export function getCoreGroupDefinitions() {
  return PERMISSION_GROUPS;
}

export type OrganizationPermissionGroup = (typeof ORGANIZATION_PERMISSION_GROUPS)[number]['id'];

export function getOrganizationGroupPermissions(group: OrganizationPermissionGroup): string[] {
  return ORGANIZATION_PERMISSION_GROUPS.find((g) => g.id === group)?.permissions ?? [];
}

export function getCoreGroupForPermission(group: PermissionGroup) {
  return PERMISSION_GROUPS.find((g) => g.id === group);
}
