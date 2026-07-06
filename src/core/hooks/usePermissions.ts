import { useContext, useCallback } from 'react';
import { PermissionContext } from '../contexts/PermissionContext';
import type { CorePermission } from '../types/permission.types';

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within PermissionProvider.');
  }

  const can = useCallback(
    (permission: CorePermission) => context.hasPermission(permission),
    [context]
  );

  return {
    roles: context.roles,
    engine: context.engine,
    can,
    hasPermission: context.hasPermission,
    hasAnyPermission: context.hasAnyPermission,
    hasAllPermissions: context.hasAllPermissions,
  };
}
