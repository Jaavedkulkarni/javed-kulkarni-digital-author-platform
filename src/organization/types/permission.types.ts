import type { CorePermission } from '../../core/types/permission.types';
import type { Permission } from '../../types/roles';
import type { WorkspaceType } from './workspace.types';

export type OrganizationPermissionScope = 'workspace' | 'feature' | 'resource';

export interface OrganizationPermission {
  id: string;
  key: string;
  label: string;
  scope: OrganizationPermissionScope;
  group: string;
  inheritsFrom?: string[];
}

export interface WorkspacePermissionGrant {
  workspace: WorkspaceType;
  permissions: string[];
}

export interface FeaturePermissionGrant {
  feature: string;
  permissions: string[];
}

export interface ResourcePermissionGrant {
  resource: string;
  resourceId: string;
  permissions: string[];
}

export interface PermissionEvaluationContext {
  userId: string;
  roles: string[];
  workspace: WorkspaceType;
  organizationId?: string | null;
  isSuperAdmin: boolean;
  resourceOwnerId?: string;
}

export interface PermissionEvaluationResult {
  allowed: boolean;
  permission: string;
  reason?: string;
}

export interface OrganizationPermissionBridge {
  hasCorePermission: (permission: CorePermission) => boolean;
  hasLegacyPermission: (permission: Permission) => boolean;
  hasOrganizationPermission: (permission: string) => boolean;
}
