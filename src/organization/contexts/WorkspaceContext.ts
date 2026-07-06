import { createContext } from 'react';
import type { WorkspaceState, WorkspaceNavigationMeta } from '../types/workspace.types';
import type { WorkspaceSwitchResult } from '../types/workspace.types';
import type { WorkspaceType } from '../types/workspace.types';

export interface WorkspaceContextValue {
  state: WorkspaceState | null;
  navigation: WorkspaceNavigationMeta[];
  isLoading: boolean;
  switchWorkspace: (workspace: WorkspaceType) => Promise<WorkspaceSwitchResult>;
  setDefaultWorkspace: (workspace: WorkspaceType) => void;
  refresh: () => Promise<void>;
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);
