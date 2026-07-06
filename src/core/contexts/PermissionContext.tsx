import { createContext } from 'react';
import type { CoreRole, CorePermission } from '../types/permission.types';
import type { PermissionEngine } from '../permissions/permissionEngine';

export interface PermissionContextValue {
  roles: CoreRole[];
  engine: PermissionEngine;
  hasPermission: (permission: CorePermission) => boolean;
  hasAnyPermission: (permissions: CorePermission[]) => boolean;
  hasAllPermissions: (permissions: CorePermission[]) => boolean;
}

export const PermissionContext = createContext<PermissionContextValue | null>(null);
