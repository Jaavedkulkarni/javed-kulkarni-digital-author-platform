import { useContext, useMemo, type ReactNode } from 'react';
import { useContext as useReactContext } from 'react';
import { PermissionContext as CorePermissionContext } from '../../core/contexts/PermissionContext';
import { useRoles as useAppRoles } from '../../context/RoleContext';
import { OrganizationContext } from '../contexts/OrganizationContext';
import { WorkspaceContext } from '../contexts/WorkspaceContext';
import { OrganizationPermissionContext } from '../contexts/PermissionContext';
import { getOrganizationPermissionEngine } from '../permissions/permissionEngine';
import { isSuperAdmin } from '../../lib/permissions';
import { mapSystemRolesToAuthRoles } from '../utils/roleMapping';
import type { AuthRole } from '../../auth/types/roles.types';

export function OrganizationPermissionProvider({ children }: { children: ReactNode }) {
  const orgCtx = useContext(OrganizationContext);
  const workspaceCtx = useReactContext(WorkspaceContext);
  const appRoles = useAppRoles();
  const corePermission = useReactContext(CorePermissionContext);
  const engine = useMemo(() => getOrganizationPermissionEngine(), []);

  const userId = appRoles.profile?.id ?? 'guest';
  const workspace = workspaceCtx?.state?.currentWorkspace ?? 'reader';
  const superAdmin = isSuperAdmin(appRoles.roles);
  const authRoles = mapSystemRolesToAuthRoles(appRoles.roles) as AuthRole[];

  const permissionContext = useMemo(
    () =>
      orgCtx?.services.permissions.buildContext({
        userId,
        systemRoles: appRoles.roles,
        workspace,
        isSuperAdmin: superAdmin,
      }) ?? {
        userId,
        roles: appRoles.roles,
        workspace,
        organizationId: null,
        isSuperAdmin: superAdmin,
      },
    [orgCtx, userId, appRoles.roles, workspace, superAdmin]
  );

  const workspacePermissions = useMemo(
    () => engine.getWorkspacePermissions(workspace),
    [engine, workspace]
  );

  const value = useMemo(
    () => ({
      context: permissionContext,
      engine,
      hasOrganizationPermission: (permission: string) =>
        engine.evaluateOrganizationPermission(permissionContext, permission).allowed,
      hasCorePermission: (permission: Parameters<NonNullable<typeof corePermission>['hasPermission']>[0]) => {
        if (corePermission) return corePermission.hasPermission(permission);
        return engine.hasCorePermission(authRoles, permission);
      },
      hasLegacyPermission: (permission: Parameters<typeof engine.hasLegacyPermission>[1]) =>
        engine.hasLegacyPermission(appRoles.roles, permission),
      workspacePermissions,
    }),
    [permissionContext, engine, corePermission, authRoles, appRoles.roles, workspacePermissions]
  );

  return (
    <OrganizationPermissionContext.Provider value={value}>
      {children}
    </OrganizationPermissionContext.Provider>
  );
}
