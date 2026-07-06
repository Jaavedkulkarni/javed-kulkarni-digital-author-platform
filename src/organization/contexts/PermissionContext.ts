import { createContext } from 'react';
import type { CorePermission } from '../../core/types/permission.types';
import type { Permission } from '../../types/roles';
import type { PermissionEvaluationContext } from '../types/permission.types';
import type { OrganizationPermissionEngine } from '../permissions/permissionEngine';

export interface OrganizationPermissionContextValue {
  context: PermissionEvaluationContext;
  engine: OrganizationPermissionEngine;
  hasOrganizationPermission: (permission: string) => boolean;
  hasCorePermission: (permission: CorePermission) => boolean;
  hasLegacyPermission: (permission: Permission) => boolean;
  workspacePermissions: string[];
}

export const OrganizationPermissionContext =
  createContext<OrganizationPermissionContextValue | null>(null);
