import type { User } from '@supabase/supabase-js';

export type AppRole = 'reader' | 'admin';

/** Known admin accounts when no profiles/admin table exists. */
const ADMIN_EMAILS = ['jaavedkulkarni@gmail.com'];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === normalized);
}

export function getUserRole(user: User | null | undefined): AppRole | null {
  if (!user) return null;
  if (isAdminEmail(user.email)) return 'admin';

  const role = user.user_metadata?.role as string | undefined;
  if (role === 'reader') return 'reader';
  if (role === 'admin') return 'admin';
  return null;
}

/** Legacy Supabase users without role metadata are treated as admins. */
export function isAdminUser(user: User | null | undefined): boolean {
  if (!user) return false;
  if (isAdminEmail(user.email)) return true;
  const role = getUserRole(user);
  return role === 'admin' || role === null;
}

export function isReaderUser(user: User | null | undefined): boolean {
  if (!user || isAdminEmail(user.email)) return false;
  return getUserRole(user) === 'reader';
}

/** Repair admin metadata if a reader OAuth flow incorrectly stamped role=reader. */
export function adminMetadataNeedsRepair(user: User): boolean {
  return isAdminEmail(user.email) && user.user_metadata?.role === 'reader';
}
