import { memo, type ReactNode } from 'react';
import type { RoutePermissionKey } from '../../constants/pagePermissions';
import { ROUTE_PERMISSIONS } from '../../constants/pagePermissions';
import { PermissionGuard } from './PermissionGuard';

interface RouteGuardProps {
  route: RoutePermissionKey;
  children: ReactNode;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
  mode?: 'all' | 'any';
}

/** Permission-driven route guard — does not modify app routing configuration. */
export const RouteGuard = memo(function RouteGuard(props: RouteGuardProps) {
  return (
    <PermissionGuard
      permissions={ROUTE_PERMISSIONS[props.route]}
      mode={props.mode ?? 'any'}
      fallback={props.fallback}
      loadingFallback={props.loadingFallback}
    >
      {props.children}
    </PermissionGuard>
  );
});

export default RouteGuard;
