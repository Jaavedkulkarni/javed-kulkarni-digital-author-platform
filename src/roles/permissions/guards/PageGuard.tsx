import { memo, type ReactNode } from 'react';
import type { PagePermissionKey } from '../../constants/pagePermissions';
import { PAGE_PERMISSIONS } from '../../constants/pagePermissions';
import { PermissionGuard } from './PermissionGuard';

interface PageGuardProps {
  page: PagePermissionKey;
  children: ReactNode;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
  mode?: 'all' | 'any';
}

/** Declares required permissions for a protected page. */
export const PageGuard = memo(function PageGuard(props: PageGuardProps) {
  return (
    <PermissionGuard
      permissions={PAGE_PERMISSIONS[props.page]}
      mode={props.mode ?? 'any'}
      fallback={props.fallback}
      loadingFallback={props.loadingFallback}
    >
      {props.children}
    </PermissionGuard>
  );
});

export default PageGuard;
