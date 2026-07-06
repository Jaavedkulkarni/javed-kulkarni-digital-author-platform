import type { WorkspacePreference } from '../types/workspace.types';
import { WORKSPACE_STORAGE_KEY } from '../constants/workspace.constants';

export function loadWorkspacePreference(userId: string): WorkspacePreference | null {
  try {
    const raw = localStorage.getItem(`${WORKSPACE_STORAGE_KEY}_${userId}`);
    if (!raw) return null;
    return JSON.parse(raw) as WorkspacePreference;
  } catch {
    return null;
  }
}

export function saveWorkspacePreference(preference: WorkspacePreference): void {
  try {
    localStorage.setItem(
      `${WORKSPACE_STORAGE_KEY}_${preference.userId}`,
      JSON.stringify(preference)
    );
  } catch {
    // Storage unavailable — non-fatal
  }
}

export function clearWorkspacePreference(userId: string): void {
  try {
    localStorage.removeItem(`${WORKSPACE_STORAGE_KEY}_${userId}`);
  } catch {
    // non-fatal
  }
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
