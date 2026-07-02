import type { User } from '@supabase/supabase-js';
import type { SystemRole } from '../types/roles';
import {
  canManageBlog,
  canManageBooks,
  canManageMedia,
  canManageReaders,
  canManageSettings,
  canManageUsers,
  canManageWebsite,
  hasPermission,
  isAdmin,
  isAuthor,
  isReader,
  isSuperAdmin,
  legacyAdminMetadataNeedsRepair,
  legacyIsAdminUser,
  legacyIsReaderUser,
  resolveLegacyRolesFromUser,
} from './permissions';

export type AppRole = SystemRole;

export { LEGACY_SUPER_ADMIN_EMAILS as ADMIN_EMAILS, isLegacySuperAdminEmail as isAdminEmail } from './permissions';

/** Sync role resolution — prefers DB roles via RoleContext when available. */
export function getUserRolesFromLegacy(user: User | null | undefined): SystemRole[] {
  return resolveLegacyRolesFromUser(user);
}

export function getUserRole(user: User | null | undefined): SystemRole | null {
  const roles = resolveLegacyRolesFromUser(user);
  if (roles.includes('super_admin')) return 'super_admin';
  if (roles.includes('admin')) return 'admin';
  if (roles.includes('author')) return 'author';
  if (user?.user_metadata?.role === 'reader') return 'reader';
  return null;
}

export function isAdminUser(user: User | null | undefined): boolean {
  return legacyIsAdminUser(user);
}

export function isReaderUser(user: User | null | undefined): boolean {
  return legacyIsReaderUser(user);
}

export function isSuperAdminUser(user: User | null | undefined): boolean {
  if (!user) return false;
  return resolveLegacyRolesFromUser(user).includes('super_admin');
}

export function isAuthorUser(user: User | null | undefined): boolean {
  if (!user) return false;
  return resolveLegacyRolesFromUser(user).includes('author');
}

export function adminMetadataNeedsRepair(user: User): boolean {
  return legacyAdminMetadataNeedsRepair(user);
}

export {
  isSuperAdmin,
  isAuthor,
  isAdmin,
  isReader,
  hasPermission,
  canManageBooks,
  canManageBlog,
  canManageUsers,
  canManageWebsite,
  canManageSettings,
  canManageMedia,
  canManageReaders,
} from './permissions';
