import type { OrganizationType } from '../types/organization.types';
import type { WorkspaceType } from '../types/workspace.types';

export function organizationTypeToWorkspace(type: OrganizationType): WorkspaceType | null {
  if (type === 'publisher_company') return 'publisher';
  if (type === 'platform') return 'platform_admin';
  return null;
}

export function workspaceRequiresOrganization(workspace: WorkspaceType): boolean {
  return workspace === 'publisher' || workspace === 'platform_admin';
}
