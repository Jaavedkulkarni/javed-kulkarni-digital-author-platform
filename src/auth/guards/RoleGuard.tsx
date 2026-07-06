import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import type { AuthRole } from '../types/roles.types';
import { getLoginPathForAuthRole } from '../utils/roleRouting';

interface RoleGuardProps {
  allowedRoles: AuthRole | AuthRole[];
  redirectTo?: string;
  children?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, redirectTo, children }: RoleGuardProps) {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const { role, hasRole } = useRole();
  const location = useLocation();

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading session…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo ?? getLoginPathForAuthRole(role)} replace state={{ from: location }} />;
  }

  if (!hasRole(roles)) {
    return <Navigate to={redirectTo ?? '/auth/unauthorized'} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default RoleGuard;
