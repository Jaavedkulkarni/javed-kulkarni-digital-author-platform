import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import { ForbiddenError, NotFoundError } from '../errors/app-error.ts';

export async function requireSuperAdmin(userClient: SupabaseClient, actorUserId: string): Promise<void> {
  const { data, error } = await userClient
    .from('user_roles')
    .select('roles!inner(name)')
    .eq('user_id', actorUserId)
    .eq('is_active', true)
    .eq('roles.name', 'super_admin')
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new ForbiddenError('Unable to verify permissions');
  }

  if (!data) {
    throw new ForbiddenError('Super Admin access required');
  }
}

export async function assertProfileExists(
  adminClient: SupabaseClient,
  userId: string,
): Promise<{ id: string; status: string; deleted_at: string | null }> {
  const { data, error } = await adminClient
    .from('profiles')
    .select('id, status, deleted_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new NotFoundError('User profile not found');
  }

  return data;
}
