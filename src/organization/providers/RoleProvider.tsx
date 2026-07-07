import { useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useRoles as useAppRoles } from '../../context/RoleContext';
import { useBootstrap } from '../../auth/bootstrap/hooks';
import { OrganizationContext } from '../contexts/OrganizationContext';
import { OrganizationRoleContext } from '../contexts/RoleContext';
import type { UserRoleAssignment } from '../types/role.types';

export function OrganizationRoleProvider({ children }: { children: ReactNode }) {
  const orgCtx = useContext(OrganizationContext);
  const appRoles = useAppRoles();
  const bootstrap = useBootstrap();
  const userId = appRoles.profile?.id ?? bootstrap.user?.id ?? null;

  const refresh = useCallback(async () => {
    await appRoles.refreshRoles();
  }, [appRoles]);

  const assignments = useMemo<UserRoleAssignment[]>(() => {
    if (!userId || !bootstrap.isReady) return [];
    return bootstrap.assignedRoles.map((roleName) => ({
      userId,
      roleId: roleName,
      roleName,
      assignedAt: '',
      assignedBy: null,
    }));
  }, [bootstrap.assignedRoles, bootstrap.isReady, userId]);

  const roleContext = useMemo(() => {
    if (!userId || !orgCtx || !bootstrap.isReady) return null;
    return orgCtx.services.roles.buildRoleContext(bootstrap.assignedRoles);
  }, [bootstrap.assignedRoles, bootstrap.isReady, orgCtx, userId]);

  const value = useMemo(
    () => ({
      roleContext,
      assignments,
      isLoading: Boolean(userId && !bootstrap.isReady),
      refresh,
    }),
    [assignments, bootstrap.isReady, refresh, roleContext, userId],
  );

  return (
    <OrganizationRoleContext.Provider value={value}>{children}</OrganizationRoleContext.Provider>
  );
}

export { OrganizationRoleProvider as RoleProvider };
