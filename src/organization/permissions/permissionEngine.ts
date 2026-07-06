import type { CorePermission } from '../../core/types/permission.types';
import type { Permission } from '../../types/roles';
import type {
  PermissionEvaluationContext,
  PermissionEvaluationResult,
} from '../types/permission.types';
import type { WorkspaceType } from '../types/workspace.types';
import { expandPermissionSet } from './inheritance';
import { ORGANIZATION_PERMISSION_REGISTRY } from './permissionRegistry';
import { getPermissionEngine } from '../../core/permissions/permissionEngine';
import { mapAuthRolesToSystemRoles } from '../../core/utils/roleBridge';
import { hasPermission as legacyHasPermission } from '../../lib/permissions';
import type { AuthRole } from '../../auth/types/roles.types';
import type { SystemRole } from '../../types/roles';

const WORKSPACE_PERMISSIONS: Record<WorkspaceType, string[]> = {
  reader: ['workspace:switch', 'feature:author_dashboard'],
  author: ['workspace:switch', 'feature:author_dashboard', 'org:view'],
  publisher: ['workspace:switch', 'feature:publisher_dashboard', 'org:view', 'org:members:view'],
  platform_admin: ['workspace:switch', 'org:view', 'org:manage', 'org:members:invite', 'org:settings'],
  super_admin: ORGANIZATION_PERMISSION_REGISTRY.map((p) => p.key),
};

export class OrganizationPermissionEngine {
  private readonly coreEngine = getPermissionEngine();

  getWorkspacePermissions(workspace: WorkspaceType): string[] {
    return expandPermissionSet(WORKSPACE_PERMISSIONS[workspace] ?? []);
  }

  evaluateOrganizationPermission(
    context: PermissionEvaluationContext,
    permission: string
  ): PermissionEvaluationResult {
    if (context.isSuperAdmin) {
      return { allowed: true, permission };
    }

    const granted = this.getGrantedPermissions(context);
    const allowed = granted.includes(permission);
    return {
      allowed,
      permission,
      reason: allowed ? undefined : `Missing permission "${permission}" in workspace "${context.workspace}".`,
    };
  }

  getGrantedPermissions(context: PermissionEvaluationContext): string[] {
    if (context.isSuperAdmin) {
      return ORGANIZATION_PERMISSION_REGISTRY.map((p) => p.key);
    }
    const workspacePerms = this.getWorkspacePermissions(context.workspace);
    return expandPermissionSet(workspacePerms);
  }

  hasCorePermission(authRoles: AuthRole[], permission: CorePermission): boolean {
    return this.coreEngine.hasPermission(authRoles, permission);
  }

  hasLegacyPermission(systemRoles: SystemRole[], permission: Permission): boolean {
    return legacyHasPermission(systemRoles, permission);
  }

  evaluateResourcePermission(
    context: PermissionEvaluationContext,
    permission: string,
    resourceOwnerId: string
  ): PermissionEvaluationResult {
    if (context.isSuperAdmin) return { allowed: true, permission };
    if (context.userId === resourceOwnerId) {
      return this.evaluateOrganizationPermission(context, permission);
    }
    const orgManage = this.evaluateOrganizationPermission(context, 'org:manage');
    if (orgManage.allowed) return { allowed: true, permission };
    return { allowed: false, permission, reason: 'Not resource owner or organization admin.' };
  }
}

let engineInstance: OrganizationPermissionEngine | null = null;

export function getOrganizationPermissionEngine(): OrganizationPermissionEngine {
  if (!engineInstance) engineInstance = new OrganizationPermissionEngine();
  return engineInstance;
}

export function resetOrganizationPermissionEngine(): void {
  engineInstance = null;
}

export function mapSystemRolesToAuthRoles(systemRoles: SystemRole[]): AuthRole[] {
  const auth: AuthRole[] = ['reader'];
  if (systemRoles.includes('author')) auth.push('author');
  if (systemRoles.includes('admin')) auth.push('admin');
  if (systemRoles.includes('super_admin')) auth.push('admin');
  return [...new Set(auth)];
}

export function resolveAuthRolesForPermissionCheck(
  systemRoles: SystemRole[],
  extraAuthRoles: AuthRole[] = []
): AuthRole[] {
  const mapped = mapSystemRolesToAuthRoles(systemRoles);
  return [...new Set([...mapped, ...extraAuthRoles])];
}

export { mapAuthRolesToSystemRoles };
