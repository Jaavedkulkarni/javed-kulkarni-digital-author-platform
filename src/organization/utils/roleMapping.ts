import type { AuthRole } from '../../auth/types/roles.types';
import type { SystemRole } from '../../types/roles';
import type { WorkspaceType } from '../types/workspace.types';
import { WORKSPACE_DEFINITIONS } from '../constants/workspace.constants';

export function systemRoleToWorkspace(role: SystemRole): WorkspaceType | null {
  if (role === 'super_admin') return 'super_admin';
  if (role === 'admin') return 'platform_admin';
  if (role === 'author') return 'author';
  if (role === 'reader') return 'reader';
  return null;
}

export function authRoleToWorkspace(role: AuthRole): WorkspaceType | null {
  if (role === 'admin') return 'platform_admin';
  if (role === 'author') return 'author';
  if (role === 'publisher') return 'publisher';
  if (role === 'reader') return 'reader';
  return null;
}

export function resolveAvailableWorkspaces(params: {
  systemRoles: SystemRole[];
  authRoles: AuthRole[];
  hasPublisherMembership: boolean;
}): WorkspaceType[] {
  const available = new Set<WorkspaceType>(['reader']);

  if (params.systemRoles.includes('super_admin')) {
    available.add('super_admin');
    available.add('platform_admin');
    available.add('author');
    available.add('publisher');
    return [...available];
  }

  if (params.systemRoles.includes('admin') || params.authRoles.includes('admin')) {
    available.add('platform_admin');
  }
  if (params.systemRoles.includes('author') || params.authRoles.includes('author')) {
    available.add('author');
  }
  if (params.authRoles.includes('publisher') || params.hasPublisherMembership) {
    available.add('publisher');
  }

  return WORKSPACE_DEFINITIONS.map((w) => w.type).filter((w) => available.has(w));
}

export function mapSystemRolesToAuthRoles(systemRoles: SystemRole[]): AuthRole[] {
  const roles: AuthRole[] = ['reader'];
  if (systemRoles.includes('author')) roles.push('author');
  if (systemRoles.includes('admin') || systemRoles.includes('super_admin')) roles.push('admin');
  return roles;
}
