import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBootstrap } from '../bootstrap/hooks';
import { resolvePostLoginRouteFromEffectiveRoles } from '../routing/resolvePostLoginRoute';
import { useEffect, useState } from 'react';

interface GuestRouteProps {
  redirectTo?: string;
  children?: React.ReactNode;
}

export function GuestRoute({ redirectTo, children }: GuestRouteProps) {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const { isReady: bootstrapReady, effectiveRoles } = useBootstrap();
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !isInitialized || !bootstrapReady) return;

    if (redirectTo) {
      setRedirectTarget(redirectTo);
      return;
    }

    setRedirectTarget(resolvePostLoginRouteFromEffectiveRoles(effectiveRoles));
  }, [isAuthenticated, isInitialized, bootstrapReady, effectiveRoles, redirectTo]);

  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading session…</p>
      </div>
    );
  }

  if (isAuthenticated) {
    if (!bootstrapReady || !redirectTarget) {
      return (
        <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading session…</p>
        </div>
      );
    }
    return <Navigate to={redirectTarget} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default GuestRoute;
