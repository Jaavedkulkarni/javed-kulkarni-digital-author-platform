import type { WorkspacePreference } from '../types/workspace.types';
import type { WorkspaceType } from '../types/workspace.types';
import { DEFAULT_WORKSPACE } from '../constants/workspace.constants';
import { loadWorkspacePreference, saveWorkspacePreference, clearWorkspacePreference } from '../utils/persistence';

export function getWorkspacePreference(userId: string): WorkspacePreference {
  const stored = loadWorkspacePreference(userId);
  if (stored) return stored;
  return {
    userId,
    currentWorkspace: DEFAULT_WORKSPACE,
    lastActiveWorkspace: null,
    defaultWorkspace: DEFAULT_WORKSPACE,
    updatedAt: new Date().toISOString(),
  };
}

export function setCurrentWorkspace(userId: string, workspace: WorkspaceType): WorkspacePreference {
  const existing = getWorkspacePreference(userId);
  const updated: WorkspacePreference = {
    ...existing,
    lastActiveWorkspace: existing.currentWorkspace,
    currentWorkspace: workspace,
    updatedAt: new Date().toISOString(),
  };
  saveWorkspacePreference(updated);
  return updated;
}

export function setDefaultWorkspace(userId: string, workspace: WorkspaceType): WorkspacePreference {
  const existing = getWorkspacePreference(userId);
  const updated: WorkspacePreference = {
    ...existing,
    defaultWorkspace: workspace,
    updatedAt: new Date().toISOString(),
  };
  saveWorkspacePreference(updated);
  return updated;
}

export function resetWorkspacePreferenceStore(userId?: string): void {
  if (userId) clearWorkspacePreference(userId);
}
