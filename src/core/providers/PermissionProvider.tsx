import { useMemo, type ReactNode } from 'react';
import type { CoreRole } from '../types/permission.types';
import { PermissionContext, type PermissionContextValue } from '../contexts/PermissionContext';
import { createPermissionEngine } from '../permissions/permissionEngine';

export interface PermissionProviderProps {
  children: ReactNode;
  roles?: CoreRole[];
  engine?: ReturnType<typeof createPermissionEngine>;
}

export function PermissionProvider({
  children,
  roles = [],
  engine = createPermissionEngine(),
}: PermissionProviderProps) {
  const value = useMemo<PermissionContextValue>(
    () => ({
      roles,
      engine,
      hasPermission: (permission) => engine.hasPermission(roles, permission),
      hasAnyPermission: (permissions) => engine.hasAnyPermission(roles, permissions),
      hasAllPermissions: (permissions) => engine.hasAllPermissions(roles, permissions),
    }),
    [roles, engine]
  );

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}
