import { useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoles as useAppRoles } from '../../context/RoleContext';
import { OrganizationContext } from '../contexts/OrganizationContext';
import { OrganizationRoleContext } from '../contexts/RoleContext';
import { organizationQueryKeys } from '../query/queryKeys';

export function OrganizationRoleProvider({ children }: { children: ReactNode }) {
  const orgCtx = useContext(OrganizationContext);
  const appRoles = useAppRoles();
  const userId = appRoles.profile?.id ?? null;

  const rolesQuery = useQuery({
    queryKey: organizationQueryKeys.roles(userId ?? 'guest'),
    queryFn: async () => {
      if (!userId || !orgCtx) return { assignments: [], roleContext: null };
      const assignments = await orgCtx.services.roles.getUserRoleAssignments(userId);
      const dbRoles = assignments.map((a) => a.roleName);
      const merged = [...new Set([...appRoles.roles, ...dbRoles])];
      const roleContext = orgCtx.services.roles.buildRoleContext(merged as typeof appRoles.roles);
      return { assignments, roleContext };
    },
    enabled: Boolean(userId && orgCtx),
  });

  const refresh = useCallback(async () => {
    await rolesQuery.refetch();
    await appRoles.refreshRoles();
  }, [rolesQuery, appRoles]);

  const value = useMemo(
    () => ({
      roleContext: rolesQuery.data?.roleContext ?? null,
      assignments: rolesQuery.data?.assignments ?? [],
      isLoading: rolesQuery.isLoading || appRoles.loading,
      refresh,
    }),
    [rolesQuery.data, rolesQuery.isLoading, appRoles.loading, refresh]
  );

  return (
    <OrganizationRoleContext.Provider value={value}>{children}</OrganizationRoleContext.Provider>
  );
}

export { OrganizationRoleProvider as RoleProvider };
