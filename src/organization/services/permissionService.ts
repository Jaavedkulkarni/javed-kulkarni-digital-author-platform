import type { CorePermission } from '../../core/types/permission.types';
import type { Permission } from '../../types/roles';
import type { PermissionEvaluationContext, PermissionEvaluationResult } from '../types/permission.types';
import type { WorkspaceType } from '../types/workspace.types';
import type { AuthRole } from '../../auth/types/roles.types';
import type { SystemRole } from '../../types/roles';
import { OrganizationPermissionEngine, getOrganizationPermissionEngine } from '../permissions/permissionEngine';
import { ORGANIZATION_PERMISSION_REGISTRY } from '../permissions/permissionRegistry';

export class PermissionService {
  constructor(private readonly engine: OrganizationPermissionEngine = getOrganizationPermissionEngine()) {}

  getRegistry() {
    return ORGANIZATION_PERMISSION_REGISTRY;
  }

  evaluate(context: PermissionEvaluationContext, permission: string): PermissionEvaluationResult {
    return this.engine.evaluateOrganizationPermission(context, permission);
  }

  hasOrganizationPermission(context: PermissionEvaluationContext, permission: string): boolean {
    return this.evaluate(context, permission).allowed;
  }

  hasCorePermission(authRoles: AuthRole[], permission: CorePermission): boolean {
    return this.engine.hasCorePermission(authRoles, permission);
  }

  hasLegacyPermission(systemRoles: SystemRole[], permission: Permission): boolean {
    return this.engine.hasLegacyPermission(systemRoles, permission);
  }

  buildContext(params: {
    userId: string;
    systemRoles: SystemRole[];
    workspace: WorkspaceType;
    organizationId?: string | null;
    isSuperAdmin: boolean;
  }): PermissionEvaluationContext {
    return {
      userId: params.userId,
      roles: params.systemRoles,
      workspace: params.workspace,
      organizationId: params.organizationId ?? null,
      isSuperAdmin: params.isSuperAdmin,
    };
  }

  refreshWorkspacePermissions(workspace: WorkspaceType): string[] {
    return this.engine.getWorkspacePermissions(workspace);
  }
}

export function createPermissionService(): PermissionService {
  return new PermissionService();
}
