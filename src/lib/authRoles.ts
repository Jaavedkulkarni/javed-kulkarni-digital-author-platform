import type { User } from '@supabase/supabase-js';

export type AppRole = 'reader' | 'admin';

export function getUserRole(user: User | null | undefined): AppRole | null {
  if (!user) return null;
  const role = user.user_metadata?.role as string | undefined;
  if (role === 'reader') return 'reader';
  if (role === 'admin') return 'admin';
  return null;
}

/** Legacy Supabase users without role metadata are treated as admins. */
export function isAdminUser(user: User | null | undefined): boolean {
  if (!user) return false;
  const role = getUserRole(user);
  return role === 'admin' || role === null;
}

export function isReaderUser(user: User | null | undefined): boolean {
  return getUserRole(user) === 'reader';
}
