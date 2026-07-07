import { memo, type ReactNode } from 'react';
import type { PermissionAction, PermissionResource } from '../../types/permission.types';
import { buildActionPermission } from '../../constants/actionPermissions';
import { PermissionGuard } from './PermissionGuard';

interface ActionGuardProps {
  resource: PermissionResource;
  action: PermissionAction;
  children: ReactNode;
  fallback?: ReactNode | null;
  loadingFallback?: ReactNode;
}

export const ActionGuard = memo(function ActionGuard({
  resource,
  action,
  children,
  fallback = null,
  loadingFallback,
}: ActionGuardProps) {
  return (
    <PermissionGuard
      permissions={[buildActionPermission(resource, action)]}
      fallback={fallback}
      loadingFallback={loadingFallback}
    >
      {children}
    </PermissionGuard>
  );
});

export default ActionGuard;
