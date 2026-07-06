import type { OrganizationPermission } from '../types/permission.types';

export const ORGANIZATION_PERMISSION_REGISTRY: OrganizationPermission[] = [
  { id: 'org:view', key: 'org:view', label: 'View Organization', scope: 'workspace', group: 'organization' },
  { id: 'org:manage', key: 'org:manage', label: 'Manage Organization', scope: 'workspace', group: 'organization', inheritsFrom: ['org:view'] },
  { id: 'org:members:view', key: 'org:members:view', label: 'View Members', scope: 'workspace', group: 'organization', inheritsFrom: ['org:view'] },
  { id: 'org:members:invite', key: 'org:members:invite', label: 'Invite Members', scope: 'workspace', group: 'organization', inheritsFrom: ['org:members:view'] },
  { id: 'org:settings', key: 'org:settings', label: 'Organization Settings', scope: 'workspace', group: 'organization', inheritsFrom: ['org:manage'] },
  { id: 'workspace:switch', key: 'workspace:switch', label: 'Switch Workspace', scope: 'workspace', group: 'workspace' },
  { id: 'feature:publisher_dashboard', key: 'feature:publisher_dashboard', label: 'Publisher Dashboard', scope: 'feature', group: 'publisher' },
  { id: 'feature:author_dashboard', key: 'feature:author_dashboard', label: 'Author Dashboard', scope: 'feature', group: 'author' },
  { id: 'resource:org:manage', key: 'resource:org:manage', label: 'Manage Organization Resource', scope: 'resource', group: 'organization' },
];

export function getPermissionByKey(key: string): OrganizationPermission | undefined {
  return ORGANIZATION_PERMISSION_REGISTRY.find((p) => p.key === key);
}
