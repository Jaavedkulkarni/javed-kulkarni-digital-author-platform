import { memo, type ReactNode } from 'react';
import type { RolePermission } from '../../types/permission.types';
import type { PermissionGuardMode } from '../types/guard.types';
import { usePermissionContext } from '../providers/PermissionProvider';
import { evaluateRequirement } from '../utils/permissionChecker';
import { PermissionSkeleton } from './PermissionSkeleton';
import { Unauthorized } from './Unauthorized';
import { Forbidden } from './Forbidden';

interface BaseGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
  permissions: RolePermission[];
  mode?: PermissionGuardMode;
}

function useGuardState(permissions: RolePermission[], mode: PermissionGuardMode = 'any') {
  const ctx = usePermissionContext();

  if (ctx.isLoading) {
    return { state: 'loading' as const, allowed: false };
  }

  if (!ctx.isAuthenticated) {
    return { state: 'unauthenticated' as const, allowed: false };
  }

  const allowed = evaluateRequirement(ctx, permissions, mode);
  return { state: allowed ? ('allowed' as const) : ('forbidden' as const), allowed };
}

export const PermissionGuard = memo(function PermissionGuard({
  children,
  fallback,
  loadingFallback,
  permissions,
  mode = 'any',
}: BaseGuardProps) {
  const { state } = useGuardState(permissions, mode);

  if (state === 'loading') return <>{loadingFallback ?? <PermissionSkeleton />}</>;
  if (state === 'unauthenticated') return <>{fallback ?? <Unauthorized />}</>;
  if (state === 'forbidden') return <>{fallback ?? <Forbidden />}</>;
  return <>{children}</>;
});

export default PermissionGuard;
