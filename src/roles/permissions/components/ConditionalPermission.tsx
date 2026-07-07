import { memo, type ReactNode } from 'react';
import type { RolePermission } from '../../types/permission.types';
import { usePermissionContext } from '../providers/PermissionProvider';
import { evaluateRequirement } from '../utils/permissionChecker';
import { ActionGuard } from '../guards/ActionGuard';
import { RouteGuard } from '../guards/RouteGuard';
import type { PermissionAction, PermissionResource } from '../../types/permission.types';
import type { RoutePermissionKey } from '../../constants/pagePermissions';

interface CanProps {
  permission: RolePermission | RolePermission[];
  mode?: 'all' | 'any';
  children: ReactNode;
  fallback?: ReactNode;
}

export const Can = memo(function Can({ permission, mode = 'any', children, fallback = null }: CanProps) {
  const ctx = usePermissionContext();
  if (ctx.isLoading || !ctx.isAuthenticated) return <>{fallback}</>;
  const permissions = Array.isArray(permission) ? permission : [permission];
  return evaluateRequirement(ctx, permissions, mode) ? <>{children}</> : <>{fallback}</>;
});

export const Cannot = memo(function Cannot({ permission, mode = 'any', children, fallback = null }: CanProps) {
  const ctx = usePermissionContext();
  if (ctx.isLoading || !ctx.isAuthenticated) return <>{fallback}</>;
  const permissions = Array.isArray(permission) ? permission : [permission];
  return !evaluateRequirement(ctx, permissions, mode) ? <>{children}</> : <>{fallback}</>;
});

export const ViewIfPermission = Can;

export const HideIfPermission = memo(function HideIfPermission({
  permission,
  mode = 'any',
  children,
}: Omit<CanProps, 'fallback'>) {
  const ctx = usePermissionContext();
  if (ctx.isLoading || !ctx.isAuthenticated) return null;
  const permissions = Array.isArray(permission) ? permission : [permission];
  if (!evaluateRequirement(ctx, permissions, mode)) return null;
  return <>{children}</>;
});

interface ActionPermissionProps {
  resource: PermissionResource;
  action: PermissionAction;
  children: ReactNode;
  fallback?: ReactNode;
}

export const ActionPermission = memo(function ActionPermission({
  resource,
  action,
  children,
  fallback = null,
}: ActionPermissionProps) {
  return (
    <ActionGuard resource={resource} action={action} fallback={fallback}>
      {children}
    </ActionGuard>
  );
});

interface RoutePermissionProps {
  route: RoutePermissionKey;
  children: ReactNode;
  fallback?: ReactNode;
}

export const RoutePermission = memo(function RoutePermission({
  route,
  children,
  fallback,
}: RoutePermissionProps) {
  return (
    <RouteGuard route={route} fallback={fallback}>
      {children}
    </RouteGuard>
  );
});

export default Can;
