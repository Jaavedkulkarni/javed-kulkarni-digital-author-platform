import type { WorkspaceDefinition } from '../types/workspace.types';

export const WORKSPACE_STORAGE_KEY = 'authoros_workspace_prefs';

export const WORKSPACE_DEFINITIONS: readonly WorkspaceDefinition[] = [
  {
    type: 'reader',
    label: 'Reader',
    path: '/reader/library',
    requiredRoles: ['reader'],
    sortOrder: 10,
  },
  {
    type: 'author',
    label: 'Author',
    path: '/author',
    requiredRoles: ['author'],
    sortOrder: 20,
  },
  {
    type: 'publisher',
    label: 'Publisher',
    path: '/publisher',
    requiredRoles: ['publisher'],
    sortOrder: 30,
  },
  {
    type: 'platform_admin',
    label: 'Platform Admin',
    path: '/admin',
    requiredRoles: ['admin'],
    sortOrder: 40,
  },
  {
    type: 'super_admin',
    label: 'Super Admin',
    path: '/super',
    requiredRoles: ['admin'],
    sortOrder: 50,
  },
] as const;

export const DEFAULT_WORKSPACE = 'reader' as const;
