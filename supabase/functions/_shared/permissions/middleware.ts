import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import type { User } from 'npm:@supabase/supabase-js@2';
import { ForbiddenError } from '../errors/app-error.ts';

export async function resolveActorRoles(
  userClient: SupabaseClient,
  userId: string,
): Promise<string[]> {
  const { data, error } = await userClient
    .from('user_roles')
    .select('roles!inner(name)')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (error || !data) return [];

  return data
    .map((row) => {
      const roles = row.roles as { name: string } | { name: string }[] | null;
      if (Array.isArray(roles)) return roles[0]?.name;
      return roles?.name;
    })
    .filter((name): name is string => Boolean(name));
}

export async function requirePermission(
  userClient: SupabaseClient,
  actor: User,
  permission: 'super_admin' | 'admin' | 'staff',
): Promise<{ roles: string[]; primaryRole: string | null }> {
  const roles = await resolveActorRoles(userClient, actor.id);
  const primaryRole = roles.includes('super_admin')
    ? 'super_admin'
    : roles.includes('admin')
      ? 'admin'
      : roles[0] ?? null;

  if (permission === 'super_admin' && !roles.includes('super_admin')) {
    throw new ForbiddenError('Super Admin access required');
  }

  if (permission === 'admin' && !roles.includes('super_admin') && !roles.includes('admin')) {
    throw new ForbiddenError('Admin access required');
  }

  if (
    permission === 'staff' &&
    !roles.some((r) => ['super_admin', 'admin', 'author', 'publisher'].includes(r))
  ) {
    throw new ForbiddenError('Staff access required');
  }

  return { roles, primaryRole };
}

export { requireSuperAdmin } from './checks.ts';
