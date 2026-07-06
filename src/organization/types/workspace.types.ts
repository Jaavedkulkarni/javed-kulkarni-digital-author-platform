import type { AuthRole } from '../../auth/types/roles.types';

export type WorkspaceType = 'reader' | 'author' | 'publisher' | 'platform_admin' | 'super_admin';

export interface WorkspaceDefinition {
  type: WorkspaceType;
  label: string;
  path: string;
  requiredRoles: AuthRole[];
  sortOrder: number;
}

export interface WorkspaceState {
  currentWorkspace: WorkspaceType;
  lastActiveWorkspace: WorkspaceType | null;
  defaultWorkspace: WorkspaceType;
  availableWorkspaces: WorkspaceType[];
}

export interface WorkspacePreference {
  userId: string;
  currentWorkspace: WorkspaceType;
  lastActiveWorkspace: WorkspaceType | null;
  defaultWorkspace: WorkspaceType;
  updatedAt: string;
}

export interface WorkspaceSwitchResult {
  success: boolean;
  workspace?: WorkspaceType;
  errors?: string[];
  navigationPath?: string;
}

export interface WorkspaceNavigationMeta {
  workspace: WorkspaceType;
  label: string;
  path: string;
  isActive: boolean;
  isAvailable: boolean;
}
