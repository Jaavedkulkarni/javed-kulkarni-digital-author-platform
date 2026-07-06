import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { storeAuthReturnTo } from '../services/sessionStorage';

interface ProtectedRouteProps {
  redirectTo?: string;
  children?: React.ReactNode;
}

export function ProtectedRoute({ redirectTo = '/auth/login', children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading session…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    storeAuthReturnTo(location.pathname + location.search);
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default ProtectedRoute;
