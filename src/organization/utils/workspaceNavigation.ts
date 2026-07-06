import type { WorkspaceType } from '../types/workspace.types';
import { WORKSPACE_DEFINITIONS } from '../constants/workspace.constants';
import type { WorkspaceNavigationMeta } from '../types/workspace.types';

export function getWorkspaceNavigationMetadata(
  availableWorkspaces: WorkspaceType[],
  currentWorkspace: WorkspaceType
): WorkspaceNavigationMeta[] {
  return WORKSPACE_DEFINITIONS.map((def) => ({
    workspace: def.type,
    label: def.label,
    path: def.path,
    isActive: def.type === currentWorkspace,
    isAvailable: availableWorkspaces.includes(def.type),
  }));
}

export function getPathForWorkspace(workspace: WorkspaceType): string {
  return WORKSPACE_DEFINITIONS.find((w) => w.type === workspace)?.path ?? '/reader/library';
}
