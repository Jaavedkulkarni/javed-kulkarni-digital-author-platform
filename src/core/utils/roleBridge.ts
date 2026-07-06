import type { AuthRole } from '../../auth/types/roles.types';
import type { SystemRole, Permission } from '../../types/roles';
import type { CorePermission } from '../types/permission.types';
import { hasPermission as legacyHasPermission } from '../../lib/permissions';

const AUTH_TO_SYSTEM_ROLE: Partial<Record<AuthRole, SystemRole>> = {
  reader: 'reader',
  author: 'author',
  admin: 'admin',
};

const CORE_TO_LEGACY_PERMISSION: Partial<Record<CorePermission, Permission>> = {
  'books:read': 'read_books',
  'books:purchase': 'purchase',
  'books:bookmark': 'bookmark',
  'books:wishlist': 'wishlist',
  'books:review': 'review',
  'books:comment': 'comment',
  'books:manage_own': 'manage_own_books',
  'books:manage_all': 'manage_books',
  'cms:manage_books': 'manage_books',
  'cms:manage_categories': 'manage_categories',
  'orders:view_all': 'manage_orders',
  'orders:manage': 'manage_orders',
  'analytics:view_all': 'manage_analytics',
  'membership:manage': 'manage_settings',
};

export function mapAuthRoleToSystemRole(role: AuthRole): SystemRole | null {
  return AUTH_TO_SYSTEM_ROLE[role] ?? null;
}

export function mapAuthRolesToSystemRoles(roles: AuthRole[]): SystemRole[] {
  const mapped = roles
    .map(mapAuthRoleToSystemRole)
    .filter((role): role is SystemRole => role !== null);
  if (roles.includes('admin') && !mapped.includes('admin')) {
    mapped.push('admin');
  }
  if (roles.includes('publisher') && !mapped.includes('author')) {
    mapped.push('author');
  }
  return [...new Set(mapped)];
}

export function mapCorePermissionToLegacy(permission: CorePermission): Permission | null {
  return CORE_TO_LEGACY_PERMISSION[permission] ?? null;
}

export function checkLegacyPermission(roles: AuthRole[], permission: CorePermission): boolean {
  const legacyPermission = mapCorePermissionToLegacy(permission);
  if (!legacyPermission) return false;
  const systemRoles = mapAuthRolesToSystemRoles(roles);
  return legacyHasPermission(systemRoles, legacyPermission);
}
