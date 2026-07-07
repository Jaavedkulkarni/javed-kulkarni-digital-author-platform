import type { User } from '@supabase/supabase-js';
import type { SystemRole } from '../types/roles';
import {
  getPrimaryRole,
  isAuthor,
  isSuperAdmin,
  legacyAdminMetadataNeedsRepair,
  legacyIsAdminUser,
  legacyIsReaderUser,
  mergeRoles,
  resolveLegacyRolesFromUser,
} from './permissions';
import { getCachedRoles } from './roleCache';

export type AppRole = SystemRole;

export { LEGACY_SUPER_ADMIN_EMAILS as ADMIN_EMAILS, isLegacySuperAdminEmail as isAdminEmail } from './permissions';

function resolveUserRoles(user: User | null | undefined, dbRoles?: SystemRole[]): SystemRole[] {
  if (!user) return [];
  const fromDb = dbRoles ?? getCachedRoles(user.id) ?? [];
  return mergeRoles(fromDb, resolveLegacyRolesFromUser(user));
}

/** Sync role resolution — database roles take precedence over JWT metadata. */
export function getUserRolesFromLegacy(user: User | null | undefined, dbRoles?: SystemRole[]): SystemRole[] {
  return resolveUserRoles(user, dbRoles);
}

export function getUserRole(user: User | null | undefined, dbRoles?: SystemRole[]): SystemRole | null {
  return getPrimaryRole(resolveUserRoles(user, dbRoles));
}

export function isAdminUser(user: User | null | undefined, dbRoles?: SystemRole[]): boolean {
  return legacyIsAdminUser(user, dbRoles ?? getCachedRoles(user?.id ?? '') ?? []);
}

export function isReaderUser(user: User | null | undefined, dbRoles?: SystemRole[]): boolean {
  return legacyIsReaderUser(user, dbRoles ?? getCachedRoles(user?.id ?? '') ?? []);
}

export function isSuperAdminUser(user: User | null | undefined, dbRoles?: SystemRole[]): boolean {
  return isSuperAdmin(resolveUserRoles(user, dbRoles));
}

export function isAuthorUser(user: User | null | undefined, dbRoles?: SystemRole[]): boolean {
  return isAuthor(resolveUserRoles(user, dbRoles));
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
