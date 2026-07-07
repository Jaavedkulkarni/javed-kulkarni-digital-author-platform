import { memo, type ReactNode } from 'react';
import type { FeaturePermissionKey } from '../../constants/pagePermissions';
import { FEATURE_PERMISSIONS } from '../../constants/pagePermissions';
import { PermissionGuard } from './PermissionGuard';

interface FeatureGuardProps {
  feature: FeaturePermissionKey;
  children: ReactNode;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
  mode?: 'all' | 'any';
}

/** Permission-driven feature guard — do not pass role names from pages. */
export const FeatureGuard = memo(function FeatureGuard(props: FeatureGuardProps) {
  return (
    <PermissionGuard
      permissions={FEATURE_PERMISSIONS[props.feature]}
      mode={props.mode}
      fallback={props.fallback}
      loadingFallback={props.loadingFallback}
    >
      {props.children}
    </PermissionGuard>
  );
});

export default FeatureGuard;
