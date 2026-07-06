import type { CoreRole, CorePermission } from '../types/permission.types';
import { ALL_CORE_PERMISSIONS } from './permissionGroups';

const READER_PERMISSIONS: readonly CorePermission[] = [
  'books:read',
  'books:purchase',
  'books:bookmark',
  'books:wishlist',
  'books:review',
  'books:comment',
  'orders:view_own',
  'analytics:view_own',
  'membership:view',
  'membership:purchase',
];

const AUTHOR_PERMISSIONS: readonly CorePermission[] = [
  ...READER_PERMISSIONS,
  'books:manage_own',
  'books:publish',
  'cms:view',
  'cms:manage_books',
  'cms:manage_chapters',
  'cms:workflow',
  'analytics:view_own',
];

const PUBLISHER_PERMISSIONS: readonly CorePermission[] = [
  ...AUTHOR_PERMISSIONS,
  'cms:manage_authors',
  'cms:manage_publishers',
  'cms:manage_categories',
  'cms:manage_series',
  'orders:view_all',
  'analytics:view_all',
  'membership:manage',
];

const ADMIN_PERMISSIONS: readonly CorePermission[] = ALL_CORE_PERMISSIONS;

export const ROLE_PERMISSION_MAP: Record<CoreRole, readonly CorePermission[]> = {
  reader: READER_PERMISSIONS,
  author: AUTHOR_PERMISSIONS,
  publisher: PUBLISHER_PERMISSIONS,
  admin: ADMIN_PERMISSIONS,
};

export function getPermissionsForRole(role: CoreRole): readonly CorePermission[] {
  return ROLE_PERMISSION_MAP[role] ?? [];
}

export function getPermissionsForRoles(roles: CoreRole[]): CorePermission[] {
  const granted = new Set<CorePermission>();
  for (const role of roles) {
    for (const permission of getPermissionsForRole(role)) {
      granted.add(permission);
    }
  }
  return [...granted];
}
