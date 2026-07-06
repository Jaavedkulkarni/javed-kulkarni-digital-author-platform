import { useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRoles as useAppRoles } from '../../context/RoleContext';
import { OrganizationContext } from '../contexts/OrganizationContext';
import { WorkspaceContext } from '../contexts/WorkspaceContext';
import { organizationQueryKeys } from '../query/queryKeys';
import type { WorkspaceType } from '../types/workspace.types';
import type { AuthRole } from '../../auth/types/roles.types';
import { isSuperAdmin } from '../../lib/permissions';

function resolveExtraAuthRoles(appRoles: ReturnType<typeof useAppRoles>): AuthRole[] {
  const extra: AuthRole[] = [];
  if (appRoles.isAuthor) extra.push('author');
  if (appRoles.isAdmin) extra.push('admin');
  return extra;
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const orgCtx = useContext(OrganizationContext);
  const appRoles = useAppRoles();
  const queryClient = useQueryClient();
  const userId = appRoles.profile?.id ?? null;
  const systemRoles = appRoles.roles;
  const superAdmin = isSuperAdmin(systemRoles);

  const workspaceQuery = useQuery({
    queryKey: organizationQueryKeys.workspace(userId ?? 'guest'),
    queryFn: async () => {
      if (!userId || !orgCtx) return null;
      return orgCtx.services.workspace.getWorkspaceState(
        userId,
        systemRoles,
        resolveExtraAuthRoles(appRoles)
      );
    },
    enabled: Boolean(userId && orgCtx),
  });

  const [navigation, setNavigation] = useState(workspaceQuery.data ? orgCtx?.services.workspace.getNavigationMetadata(workspaceQuery.data) ?? [] : []);

  useEffect(() => {
    if (workspaceQuery.data && orgCtx) {
      setNavigation(orgCtx.services.workspace.getNavigationMetadata(workspaceQuery.data));
    }
  }, [workspaceQuery.data, orgCtx]);

  const switchWorkspace = useCallback(
    async (workspace: WorkspaceType) => {
      if (!userId || !orgCtx) return { success: false, errors: ['Not authenticated.'] };
      const result = await orgCtx.services.workspace.switchWorkspace(
        userId,
        workspace,
        systemRoles,
        superAdmin,
        resolveExtraAuthRoles(appRoles)
      );
      if (result.success) {
        await queryClient.invalidateQueries({ queryKey: organizationQueryKeys.workspace(userId) });
        await queryClient.invalidateQueries({ queryKey: organizationQueryKeys.permissions(userId, workspace) });
      }
      return result;
    },
    [userId, orgCtx, systemRoles, superAdmin, appRoles, queryClient]
  );

  const setDefaultWorkspace = useCallback(
    (workspace: WorkspaceType) => {
      if (!userId || !orgCtx) return;
      orgCtx.services.workspace.setDefaultWorkspace(userId, workspace);
      void queryClient.invalidateQueries({ queryKey: organizationQueryKeys.workspace(userId) });
    },
    [userId, orgCtx, queryClient]
  );

  const refresh = useCallback(async () => {
    await workspaceQuery.refetch();
  }, [workspaceQuery]);

  const value = useMemo(
    () => ({
      state: workspaceQuery.data ?? null,
      navigation,
      isLoading: workspaceQuery.isLoading || appRoles.loading,
      switchWorkspace,
      setDefaultWorkspace,
      refresh,
    }),
    [workspaceQuery.data, workspaceQuery.isLoading, appRoles.loading, navigation, switchWorkspace, setDefaultWorkspace, refresh]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}
