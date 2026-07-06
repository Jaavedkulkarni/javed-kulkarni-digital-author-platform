import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import { consumeAuthReturnTo } from '../services/sessionStorage';
import { getPostLoginPath } from '../utils/roleRouting';

interface GuestRouteProps {
  redirectTo?: string;
  children?: React.ReactNode;
}

export function GuestRoute({ redirectTo, children }: GuestRouteProps) {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const { role } = useRole();

  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading session…</p>
      </div>
    );
  }

  if (isAuthenticated) {
    const returnTo = consumeAuthReturnTo();
    const target = redirectTo ?? getPostLoginPath(role, returnTo);
    return <Navigate to={target} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default GuestRoute;
