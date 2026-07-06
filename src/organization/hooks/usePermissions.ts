import { useCallback, useContext } from 'react';
import { OrganizationPermissionContext } from '../contexts/PermissionContext';
import type { CorePermission } from '../../core/types/permission.types';
import type { Permission } from '../../types/roles';

export function usePermissions() {
  const context = useContext(OrganizationPermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within OrganizationPermissionProvider.');
  }

  const can = useCallback(
    (permission: string) => context.hasOrganizationPermission(permission),
    [context]
  );

  const canCore = useCallback(
    (permission: CorePermission) => context.hasCorePermission(permission),
    [context]
  );

  const canLegacy = useCallback(
    (permission: Permission) => context.hasLegacyPermission(permission),
    [context]
  );

  return {
    context: context.context,
    engine: context.engine,
    workspacePermissions: context.workspacePermissions,
    can,
    hasOrganizationPermission: context.hasOrganizationPermission,
    hasCorePermission: context.hasCorePermission,
    hasLegacyPermission: context.hasLegacyPermission,
    canCore,
    canLegacy,
  };
}
