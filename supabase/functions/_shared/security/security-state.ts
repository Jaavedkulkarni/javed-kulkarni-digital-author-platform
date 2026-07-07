import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import { enqueueJob } from '../jobs/queue.ts';
import type { Logger } from '../logging/logger.ts';

export async function queueSecurityNotification(
  adminClient: SupabaseClient,
  eventType: string,
  payload: Record<string, unknown>,
  logger: Logger,
): Promise<void> {
  await enqueueJob(
    adminClient,
    {
      jobType: 'notification',
      payload: { eventType, ...payload },
    },
    logger,
  );
}

export interface AccountLockState {
  locked: boolean;
  failedAttempts: number;
  lastFailedLogin: string | null;
}

export interface MfaState {
  enabled: boolean;
  method: string | null;
  recoveryCodesStatus: 'none' | 'available' | 'depleted';
  required: boolean;
}

async function readMetadata(
  adminClient: SupabaseClient,
  userId: string,
): Promise<Record<string, unknown>> {
  const { data } = await adminClient
    .from('user_security')
    .select('metadata')
    .eq('user_id', userId)
    .maybeSingle();
  return (data?.metadata as Record<string, unknown> | null) ?? {};
}

export async function readAccountLockState(
  adminClient: SupabaseClient,
  userId: string,
  bannedUntil: string | null,
): Promise<AccountLockState> {
  const metadata = await readMetadata(adminClient, userId);
  const lock = (metadata.account_lock as AccountLockState | undefined) ?? {
    locked: false,
    failedAttempts: 0,
    lastFailedLogin: null,
  };

  const lockedByBan = bannedUntil ? new Date(bannedUntil).getTime() > Date.now() : false;

  return {
    locked: lock.locked || lockedByBan,
    failedAttempts: lock.failedAttempts ?? 0,
    lastFailedLogin: lock.lastFailedLogin ?? null,
  };
}

export async function writeAccountLockState(
  adminClient: SupabaseClient,
  userId: string,
  lock: AccountLockState,
): Promise<void> {
  const metadata = await readMetadata(adminClient, userId);
  const { error } = await adminClient.from('user_security').upsert({
    user_id: userId,
    metadata: { ...metadata, account_lock: lock },
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function readMfaState(adminClient: SupabaseClient, userId: string): Promise<MfaState> {
  const metadata = await readMetadata(adminClient, userId);
  const mfa = metadata.mfa as MfaState | undefined;

  let enabled = mfa?.enabled ?? false;
  let method = mfa?.method ?? null;
  let recoveryCodesStatus = mfa?.recoveryCodesStatus ?? 'none';
  const required = mfa?.required ?? false;

  try {
    const adminAuth = adminClient.auth.admin as {
      mfa?: {
        listFactors?: (input: { userId: string }) => Promise<{
          data: { factors: Array<{ factor_type: string; status: string }> } | null;
        }>;
      };
    };

    if (adminAuth.mfa?.listFactors) {
      const { data } = await adminAuth.mfa.listFactors({ userId });
      const factors = data?.factors ?? [];
      const verified = factors.filter((f) => f.status === 'verified');
      if (verified.length > 0) {
        enabled = true;
        method = verified[0]?.factor_type ?? method;
        recoveryCodesStatus = 'available';
      }
    }
  } catch {
    // MFA admin API may be unavailable; fall back to metadata
  }

  return { enabled, method, recoveryCodesStatus, required };
}

export async function writeMfaState(
  adminClient: SupabaseClient,
  userId: string,
  mfa: Partial<MfaState>,
): Promise<void> {
  const metadata = await readMetadata(adminClient, userId);
  const current = (metadata.mfa as MfaState | undefined) ?? {
    enabled: false,
    method: null,
    recoveryCodesStatus: 'none',
    required: false,
  };

  const { error } = await adminClient.from('user_security').upsert({
    user_id: userId,
    metadata: { ...metadata, mfa: { ...current, ...mfa } },
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function writeLastPasswordChange(
  adminClient: SupabaseClient,
  userId: string,
): Promise<void> {
  const metadata = await readMetadata(adminClient, userId);
  const { error } = await adminClient.from('user_security').upsert({
    user_id: userId,
    metadata: { ...metadata, last_password_change_at: new Date().toISOString() },
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function readLastPasswordChange(
  adminClient: SupabaseClient,
  userId: string,
): Promise<string | null> {
  const metadata = await readMetadata(adminClient, userId);
  const value = metadata.last_password_change_at;
  return typeof value === 'string' ? value : null;
}
