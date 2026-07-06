import type { CoreModuleId } from '../types/module.types';
import type { CorePermission } from '../types/permission.types';
import type { CoreFeatureFlag } from '../types/featureFlag.types';

export interface NavigationEntry {
  id: string;
  moduleId: CoreModuleId;
  label: string;
  path: string;
  requiredPermission?: CorePermission;
  requiredFeature?: CoreFeatureFlag;
  sortOrder: number;
}

export const MODULE_NAVIGATION: readonly NavigationEntry[] = [
  {
    id: 'reader-library',
    moduleId: 'reader',
    label: 'Library',
    path: '/reader/library',
    requiredPermission: 'books:read',
    sortOrder: 10,
  },
  {
    id: 'author-dashboard',
    moduleId: 'cms',
    label: 'Author Dashboard',
    path: '/author',
    requiredPermission: 'cms:view',
    requiredFeature: 'author-dashboard',
    sortOrder: 20,
  },
  {
    id: 'publisher-dashboard',
    moduleId: 'cms',
    label: 'Publisher Dashboard',
    path: '/publisher',
    requiredPermission: 'cms:manage_publishers',
    requiredFeature: 'publisher-dashboard',
    sortOrder: 30,
  },
  {
    id: 'admin-dashboard',
    moduleId: 'cms',
    label: 'Admin Dashboard',
    path: '/admin',
    requiredPermission: 'cms:workflow',
    requiredFeature: 'admin-dashboard',
    sortOrder: 40,
  },
  {
    id: 'blog',
    moduleId: 'blog',
    label: 'Blog',
    path: '/blog',
    requiredFeature: 'blog',
    sortOrder: 50,
  },
] as const;

export function getNavigationForModule(moduleId: CoreModuleId): NavigationEntry[] {
  return MODULE_NAVIGATION.filter((entry) => entry.moduleId === moduleId);
}
