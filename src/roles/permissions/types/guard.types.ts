import type { SystemRole } from '../../types/roles';
import type { RolePermission } from '../types/permission.types';
import type { PermissionService } from '../services/permissionService';

export interface PermissionChecker {
  can: (permission: RolePermission) => boolean;
  cannot: (permission: RolePermission) => boolean;
  hasPermission: (permission: RolePermission) => boolean;
  hasAnyPermission: (permissions: RolePermission[]) => boolean;
  hasAllPermissions: (permissions: RolePermission[]) => boolean;
  canView: (resource: Parameters<PermissionService['canView']>[1]) => boolean;
  canCreate: (resource: Parameters<PermissionService['canCreate']>[1]) => boolean;
  canEdit: (resource: Parameters<PermissionService['canEdit']>[1]) => boolean;
  canDelete: (resource: Parameters<PermissionService['canDelete']>[1]) => boolean;
  canApprove: (resource: Parameters<PermissionService['canApprove']>[1]) => boolean;
  canReject: (resource: Parameters<PermissionService['canReject']>[1]) => boolean;
  canPublish: (resource: Parameters<PermissionService['canPublish']>[1]) => boolean;
  canExport: (resource: Parameters<PermissionService['canExport']>[1]) => boolean;
  canImport: (resource: Parameters<PermissionService['canImport']>[1]) => boolean;
  canManage: (resource: Parameters<PermissionService['canManage']>[1]) => boolean;
}

export interface PermissionContextValue extends PermissionChecker {
  roles: SystemRole[];
  permissions: Set<RolePermission>;
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFetching: boolean;
  service: PermissionService;
  refreshPermissions: () => Promise<void>;
}

export type PermissionGuardMode = 'all' | 'any';

export interface PermissionRequirement {
  permissions: RolePermission[];
  mode?: PermissionGuardMode;
}
