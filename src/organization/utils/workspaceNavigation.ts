import type { WorkspaceType } from '../types/workspace.types';
import { WORKSPACE_DEFINITIONS } from '../constants/workspace.constants';
import type { WorkspaceNavigationMeta } from '../types/workspace.types';

export function getWorkspaceNavigationMetadata(
  _availableWorkspaces: WorkspaceType[],
  _currentWorkspace: WorkspaceType
): WorkspaceNavigationMeta[] {
  // AuthorOS uses role-driven navigation — workspace switching is not part of the UX model.
  return [];
}

export function getPathForWorkspace(workspace: WorkspaceType): string {
  return WORKSPACE_DEFINITIONS.find((w) => w.type === workspace)?.path ?? '/reader/library';
}
