import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import { ConflictError, ForbiddenError } from '../errors/app-error.ts';

export async function countActiveSuperAdmins(
  adminClient: SupabaseClient,
): Promise<number> {
  const { data: roleRow, error: roleError } = await adminClient
    .from('roles')
    .select('id')
    .eq('name', 'super_admin')
    .maybeSingle();

  if (roleError || !roleRow) return 0;

  const { data: superAdminUserIds, error: userRoleError } = await adminClient
    .from('user_roles')
    .select('user_id')
    .eq('role_id', roleRow.id)
    .eq('is_active', true);

  if (userRoleError || !superAdminUserIds?.length) return 0;

  const ids = superAdminUserIds.map((row) => row.user_id);

  const { count, error } = await adminClient
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .in('id', ids)
    .eq('status', 'active')
    .is('deleted_at', null);

  if (error) return 0;
  return count ?? 0;
}

export async function userHasActiveRole(
  adminClient: SupabaseClient,
  userId: string,
  roleName: string,
): Promise<boolean> {
  const { data, error } = await adminClient
    .from('user_roles')
    .select('roles!inner(name)')
    .eq('user_id', userId)
    .eq('is_active', true)
    .eq('roles.name', roleName)
    .limit(1)
    .maybeSingle();

  if (error) return false;
  return Boolean(data);
}

export async function isProtectedSystemAccount(
  adminClient: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const { data, error } = await adminClient
    .from('user_security')
    .select('metadata')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data?.metadata) return false;

  const metadata = data.metadata as Record<string, unknown>;
  return metadata.is_system_account === true || metadata.protected_account === true;
}

export async function assertCanSuspendUser(
  adminClient: SupabaseClient,
  actorId: string,
  targetUserId: string,
): Promise<void> {
  if (actorId === targetUserId) {
    throw new ForbiddenError('You cannot suspend your own account');
  }

  if (await isProtectedSystemAccount(adminClient, targetUserId)) {
    throw new ForbiddenError('This protected system account cannot be suspended');
  }

  const isSuperAdmin = await userHasActiveRole(adminClient, targetUserId, 'super_admin');
  if (isSuperAdmin) {
    const activeSuperAdmins = await countActiveSuperAdmins(adminClient);
    if (activeSuperAdmins <= 1) {
      throw new ForbiddenError('Cannot suspend the last active Super Admin');
    }
  }
}

export async function assertCanRestoreUser(
  adminClient: SupabaseClient,
  actorId: string,
  targetUserId: string,
): Promise<void> {
  if (await isProtectedSystemAccount(adminClient, targetUserId)) {
    throw new ForbiddenError('This protected system account cannot be modified');
  }

  void actorId;
}

export async function assertProfileSuspendable(
  profile: { status: string; deleted_at: string | null },
): Promise<void> {
  if (profile.status === 'suspended') {
    throw new ConflictError('User is already suspended');
  }
  if (profile.deleted_at) {
    throw new ConflictError('Deleted users must be restored before suspension');
  }
}

export async function assertProfileRestorable(
  profile: { status: string; deleted_at: string | null },
): Promise<void> {
  if (!profile.deleted_at && profile.status === 'active') {
    throw new ConflictError('User is already active');
  }
}

export async function assertCanDeleteUser(
  adminClient: SupabaseClient,
  actorId: string,
  targetUserId: string,
): Promise<void> {
  if (actorId === targetUserId) {
    throw new ForbiddenError('You cannot delete your own account');
  }

  if (await isProtectedSystemAccount(adminClient, targetUserId)) {
    throw new ForbiddenError('This protected system account cannot be deleted');
  }

  const isSuperAdmin = await userHasActiveRole(adminClient, targetUserId, 'super_admin');
  if (isSuperAdmin) {
    const activeSuperAdmins = await countActiveSuperAdmins(adminClient);
    if (activeSuperAdmins <= 1) {
      throw new ForbiddenError('Cannot delete the last active Super Admin');
    }
  }
}

export async function assertCanRecoverUser(
  adminClient: SupabaseClient,
  actorId: string,
  targetUserId: string,
): Promise<void> {
  if (await isProtectedSystemAccount(adminClient, targetUserId)) {
    throw new ForbiddenError('This protected system account cannot be modified');
  }

  void actorId;
}

export async function assertProfileDeletable(
  profile: { status: string; deleted_at: string | null },
): Promise<void> {
  if (profile.deleted_at || profile.status === 'deleted') {
    throw new ConflictError('User is already deleted');
  }
}

export async function assertProfileRecoverable(
  profile: { status: string; deleted_at: string | null },
): Promise<void> {
  if (!profile.deleted_at && profile.status !== 'deleted') {
    throw new ConflictError('User is not deleted');
  }
}
