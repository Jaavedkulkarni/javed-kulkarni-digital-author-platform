import type { WorkspaceType } from '../types/workspace.types';

export function assertWorkspaceAccess(
  workspace: WorkspaceType,
  availableWorkspaces: WorkspaceType[]
): boolean {
  return availableWorkspaces.includes(workspace);
}

export function assertOrganizationOwnership(
  actorId: string,
  ownerId: string,
  isSuperAdmin: boolean
): boolean {
  return actorId === ownerId || isSuperAdmin;
}

export function assertNoPrivilegeEscalation(
  currentRoles: string[],
  requestedPermission: string,
  grantedPermissions: string[]
): boolean {
  if (grantedPermissions.includes(requestedPermission)) return true;
  return false;
}

export function canSuperAdminOverride(isSuperAdmin: boolean): boolean {
  return isSuperAdmin;
}
