import { useMemo } from 'react';
import { useAuth } from './useAuth';
import type { AuthRole } from '../types/roles.types';
import { DEFAULT_AUTH_ROLE } from '../types/roles.types';
import { getDashboardPathForAuthRole, roleAllowsPath } from '../utils/roleRouting';

export function useRole() {
  const { user, isAuthenticated } = useAuth();

  const role = user?.role ?? DEFAULT_AUTH_ROLE;

  const roleFlags = useMemo(
    () => ({
      isReader: role === 'reader',
      isAuthor: role === 'author',
      isPublisher: role === 'publisher',
      isAdmin: role === 'admin',
    }),
    [role]
  );

  const hasRole = useMemo(
    () => (roles: AuthRole | AuthRole[]) => {
      if (!isAuthenticated) return false;
      const required = Array.isArray(roles) ? roles : [roles];
      return required.includes(role);
    },
    [isAuthenticated, role]
  );

  const canAccess = useMemo(
    () => (pathname: string) => {
      if (!isAuthenticated) return false;
      return roleAllowsPath(role, pathname);
    },
    [isAuthenticated, role]
  );

  const dashboardPath = useMemo(() => getDashboardPathForAuthRole(role), [role]);

  return {
    role,
    ...roleFlags,
    hasRole,
    canAccess,
    dashboardPath,
  };
}
