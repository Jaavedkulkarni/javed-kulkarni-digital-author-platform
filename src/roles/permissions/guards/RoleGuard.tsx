import { memo, type ReactNode } from 'react';
import type { FeaturePermissionKey } from '../../constants/pagePermissions';
import { FEATURE_PERMISSIONS } from '../../constants/pagePermissions';
import { PermissionGuard } from './PermissionGuard';

interface RoleGuardProps {
  /** Permission bundle key — maps to feature permissions, not raw role names. */
  scope: FeaturePermissionKey;
  children: ReactNode;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
  mode?: 'all' | 'any';
}

/**
 * Permission-system RoleGuard.
 * Pages declare a permission scope — never pass SystemRole values here.
 */
export const RoleGuard = memo(function RoleGuard({
  scope,
  children,
  fallback,
  loadingFallback,
  mode = 'any',
}: RoleGuardProps) {
  return (
    <PermissionGuard
      permissions={FEATURE_PERMISSIONS[scope]}
      mode={mode}
      fallback={fallback}
      loadingFallback={loadingFallback}
    >
      {children}
    </PermissionGuard>
  );
});

export default RoleGuard;
