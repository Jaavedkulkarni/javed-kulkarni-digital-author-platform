import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import { ForbiddenError } from '../errors/app-error.ts';
import {
  assertCanDeleteUser,
  isProtectedSystemAccount,
  userHasActiveRole,
  countActiveSuperAdmins,
} from '../permissions/user-lifecycle.ts';

export async function assertCanManageAccountSecurity(
  adminClient: SupabaseClient,
  actorId: string,
  targetUserId: string,
  options: { allowSelf?: boolean } = {},
): Promise<void> {
  if (!options.allowSelf && actorId === targetUserId) {
    throw new ForbiddenError('You cannot perform this security action on your own account');
  }

  if (await isProtectedSystemAccount(adminClient, targetUserId)) {
    throw new ForbiddenError('This protected system account cannot be modified');
  }
}

export async function assertCanResetPassword(
  adminClient: SupabaseClient,
  actorId: string,
  targetUserId: string,
): Promise<void> {
  if (actorId === targetUserId) {
    throw new ForbiddenError('You cannot reset your own password through this action');
  }

  await assertCanManageAccountSecurity(adminClient, actorId, targetUserId, { allowSelf: false });

  const isSuperAdmin = await userHasActiveRole(adminClient, targetUserId, 'super_admin');
  if (isSuperAdmin) {
    const activeSuperAdmins = await countActiveSuperAdmins(adminClient);
    if (activeSuperAdmins <= 1) {
      throw new ForbiddenError('Cannot modify security for the last active Super Admin');
    }
  }
}

export async function getAuthUserEmail(
  adminClient: SupabaseClient,
  userId: string,
): Promise<{ email: string; emailConfirmedAt: string | null; lastSignInAt: string | null; bannedUntil: string | null }> {
  const { data, error } = await adminClient.auth.admin.getUserById(userId);
  if (error || !data.user) {
    throw error ?? new Error('Auth user not found');
  }

  return {
    email: data.user.email ?? '',
    emailConfirmedAt: data.user.email_confirmed_at ?? null,
    lastSignInAt: data.user.last_sign_in_at ?? null,
    bannedUntil: data.user.banned_until ?? null,
  };
}
