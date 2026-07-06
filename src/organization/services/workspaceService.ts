import type { IOrganizationRepository } from '../repositories/organizationRepository';
import type { IAuditLogRepository } from '../repositories/auditLogRepository';
import type { WorkspaceType, WorkspaceState, WorkspaceSwitchResult, WorkspaceNavigationMeta } from '../types/workspace.types';
import type { SystemRole } from '../../types/roles';
import type { AuthRole } from '../../auth/types/roles.types';
import { resolveAvailableWorkspaces, mapSystemRolesToAuthRoles } from '../utils/roleMapping';
import { getWorkspaceNavigationMetadata, getPathForWorkspace } from '../utils/workspaceNavigation';
import { validateWorkspaceSwitch } from '../validators/workspaceValidator';
import { getWorkspacePreference, setCurrentWorkspace, setDefaultWorkspace } from '../stores/workspacePreferenceStore';
import { DEFAULT_WORKSPACE } from '../constants/workspace.constants';
import { assertWorkspaceAccess } from '../utils/security';

export class WorkspaceService {
  constructor(
    private readonly orgRepo: IOrganizationRepository,
    private readonly auditRepo: IAuditLogRepository
  ) {}

  async resolveAvailableWorkspaces(
    userId: string,
    systemRoles: SystemRole[],
    extraAuthRoles: AuthRole[] = []
  ): Promise<WorkspaceType[]> {
    const hasPublisher = await this.orgRepo.userHasPublisherMembership(userId);
    const authRoles = [...new Set([...mapSystemRolesToAuthRoles(systemRoles), ...extraAuthRoles])];
    return resolveAvailableWorkspaces({ systemRoles, authRoles, hasPublisherMembership: hasPublisher });
  }

  async getWorkspaceState(
    userId: string,
    systemRoles: SystemRole[],
    extraAuthRoles: AuthRole[] = []
  ): Promise<WorkspaceState> {
    const available = await this.resolveAvailableWorkspaces(userId, systemRoles, extraAuthRoles);
    const prefs = getWorkspacePreference(userId);
    let current = prefs.currentWorkspace;
    if (!assertWorkspaceAccess(current, available)) {
      current = available.includes(prefs.defaultWorkspace)
        ? prefs.defaultWorkspace
        : available[0] ?? DEFAULT_WORKSPACE;
    }
    return {
      currentWorkspace: current,
      lastActiveWorkspace: prefs.lastActiveWorkspace,
      defaultWorkspace: prefs.defaultWorkspace,
      availableWorkspaces: available,
    };
  }

  getNavigationMetadata(state: WorkspaceState): WorkspaceNavigationMeta[] {
    return getWorkspaceNavigationMetadata(state.availableWorkspaces, state.currentWorkspace);
  }

  async switchWorkspace(
    userId: string,
    target: WorkspaceType,
    systemRoles: SystemRole[],
    isSuperAdmin: boolean,
    extraAuthRoles: AuthRole[] = []
  ): Promise<WorkspaceSwitchResult> {
    let available = await this.resolveAvailableWorkspaces(userId, systemRoles, extraAuthRoles);
    if (isSuperAdmin) {
      available = ['reader', 'author', 'publisher', 'platform_admin', 'super_admin'];
    }
    const validation = validateWorkspaceSwitch(target, available);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }
    setCurrentWorkspace(userId, target);
    await this.auditRepo.append({
      eventType: 'workspace_switch',
      actorId: userId,
      metadata: { from: getWorkspacePreference(userId).lastActiveWorkspace, to: target },
    });
    return {
      success: true,
      workspace: target,
      navigationPath: getPathForWorkspace(target),
    };
  }

  setDefaultWorkspace(userId: string, workspace: WorkspaceType): void {
    setDefaultWorkspace(userId, workspace);
  }

  refreshPermissions(
    systemRoles: SystemRole[],
    workspace: WorkspaceType,
    isSuperAdmin: boolean
  ): { workspace: WorkspaceType; roles: SystemRole[]; isSuperAdmin: boolean } {
    return { workspace, roles: systemRoles, isSuperAdmin };
  }
}

export function createWorkspaceService(
  orgRepo: IOrganizationRepository,
  auditRepo: IAuditLogRepository
): WorkspaceService {
  return new WorkspaceService(orgRepo, auditRepo);
}
