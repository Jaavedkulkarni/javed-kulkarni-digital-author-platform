import type { User } from '@supabase/supabase-js';
import type { Permission, SystemRole } from '../types/roles';

export const ROLE_PRIORITY: SystemRole[] = ['super_admin', 'admin', 'author', 'reader'];

/** Legacy bootstrap — used when DB roles are unavailable. */
export const LEGACY_SUPER_ADMIN_EMAILS = ['jaavedkulkarni@gmail.com'];

const ROLE_PERMISSIONS: Record<SystemRole, Permission[]> = {
  super_admin: [
    'manage_website',
    'manage_authors',
    'manage_admins',
    'manage_readers',
    'manage_books',
    'manage_blog',
    'manage_categories',
    'manage_media',
    'manage_products',
    'manage_orders',
    'manage_newsletter',
    'manage_menus',
    'manage_homepage',
    'manage_seo',
    'manage_settings',
    'manage_analytics',
    'manage_roles',
    'manage_own_books',
    'manage_own_blog',
    'manage_own_media',
    'manage_own_categories',
    'manage_own_reader_stats',
    'read_books',
    'read_blog',
    'bookmark',
    'wishlist',
    'subscribe',
    'purchase',
    'review',
    'comment',
  ],
  author: [
    'manage_own_books',
    'manage_own_blog',
    'manage_own_media',
    'manage_own_categories',
    'manage_own_reader_stats',
    'read_books',
    'read_blog',
    'bookmark',
    'wishlist',
    'subscribe',
    'purchase',
    'review',
    'comment',
  ],
  admin: [
    'manage_books',
    'manage_blog',
    'manage_categories',
    'manage_media',
    'manage_readers',
    'manage_orders',
    'read_books',
    'read_blog',
  ],
  reader: [
    'read_books',
    'read_blog',
    'bookmark',
    'wishlist',
    'subscribe',
    'purchase',
    'review',
    'comment',
  ],
};

export function isLegacySuperAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return LEGACY_SUPER_ADMIN_EMAILS.some((value) => value.toLowerCase() === normalized);
}

export function resolveLegacyRolesFromUser(user: User | null | undefined): SystemRole[] {
  if (!user) return [];
  if (isLegacySuperAdminEmail(user.email)) return ['super_admin', 'admin'];

  const metaRole = user.user_metadata?.role as string | undefined;
  if (metaRole === 'admin') return ['admin'];
  if (metaRole === 'reader') return ['reader'];
  if (!metaRole) return ['admin'];
  return [];
}

export function normalizeRoles(roles: SystemRole[]): SystemRole[] {
  return ROLE_PRIORITY.filter((role) => roles.includes(role));
}

export function getPrimaryRole(roles: SystemRole[]): SystemRole | null {
  const normalized = normalizeRoles(roles);
  return normalized[0] ?? null;
}

export function mergeRoles(dbRoles: SystemRole[], legacyRoles: SystemRole[]): SystemRole[] {
  return normalizeRoles([...new Set([...dbRoles, ...legacyRoles])]);
}

export function roleSetIncludes(roles: SystemRole[], role: SystemRole): boolean {
  return roles.includes(role);
}

export function isSuperAdmin(roles: SystemRole[]): boolean {
  return roleSetIncludes(roles, 'super_admin');
}

export function isAuthor(roles: SystemRole[]): boolean {
  return roleSetIncludes(roles, 'author');
}

export function isAdmin(roles: SystemRole[]): boolean {
  return roleSetIncludes(roles, 'admin') || isSuperAdmin(roles);
}

export function isReader(roles: SystemRole[]): boolean {
  return roleSetIncludes(roles, 'reader');
}

export function isStaff(roles: SystemRole[]): boolean {
  return isSuperAdmin(roles) || isAdmin(roles) || isAuthor(roles);
}

export function collectPermissions(roles: SystemRole[]): Set<Permission> {
  const permissions = new Set<Permission>();
  for (const role of roles) {
    for (const permission of ROLE_PERMISSIONS[role]) {
      permissions.add(permission);
    }
  }
  return permissions;
}

export function hasPermission(roles: SystemRole[], permission: Permission): boolean {
  if (isSuperAdmin(roles)) return true;
  return collectPermissions(roles).has(permission);
}

export function canManageBooks(roles: SystemRole[]): boolean {
  return hasPermission(roles, 'manage_books') || hasPermission(roles, 'manage_own_books');
}

export function canManageBlog(roles: SystemRole[]): boolean {
  return hasPermission(roles, 'manage_blog') || hasPermission(roles, 'manage_own_blog');
}

export function canManageUsers(roles: SystemRole[]): boolean {
  return hasPermission(roles, 'manage_roles') || hasPermission(roles, 'manage_admins');
}

export function canManageWebsite(roles: SystemRole[]): boolean {
  return hasPermission(roles, 'manage_website');
}

export function canManageSettings(roles: SystemRole[]): boolean {
  return hasPermission(roles, 'manage_settings');
}

export function canManageProducts(roles: SystemRole[]): boolean {
  return hasPermission(roles, 'manage_products');
}

export function canManageMedia(roles: SystemRole[]): boolean {
  return hasPermission(roles, 'manage_media') || hasPermission(roles, 'manage_own_media');
}

export function canManageReaders(roles: SystemRole[]): boolean {
  return hasPermission(roles, 'manage_readers');
}

export function canAccessAdminDashboard(roles: SystemRole[]): boolean {
  return isAdmin(roles);
}

export function canAccessAuthorDashboard(roles: SystemRole[]): boolean {
  return isAuthor(roles);
}

export function canAccessSuperAdminDashboard(roles: SystemRole[]): boolean {
  return isSuperAdmin(roles);
}

export function canAccessReaderDashboard(roles: SystemRole[]): boolean {
  return isReader(roles);
}

/** Backward-compatible sync helpers using legacy metadata when roles array is empty. */
export function legacyIsAdminUser(user: User | null | undefined): boolean {
  if (!user) return false;
  const roles = resolveLegacyRolesFromUser(user);
  return isAdmin(roles);
}

export function legacyIsReaderUser(user: User | null | undefined): boolean {
  if (!user) return false;
  if (isLegacySuperAdminEmail(user.email)) return false;
  return user.user_metadata?.role === 'reader';
}

export function legacyAdminMetadataNeedsRepair(user: User): boolean {
  return isLegacySuperAdminEmail(user.email) && user.user_metadata?.role === 'reader';
}

export function resolveNavRoleFromRoles(
  roles: SystemRole[],
  isReaderAuthenticated: boolean
): 'guest' | SystemRole {
  if (isSuperAdmin(roles)) return 'super_admin';
  if (isAdmin(roles)) return 'admin';
  if (isAuthor(roles)) return 'author';
  if (isReaderAuthenticated && isReader(roles)) return 'reader';
  return 'guest';
}
