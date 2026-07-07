import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';

const DEFAULT_LOCK_TTL_MS = 30_000;

export interface AcquireLockResult {
  acquired: boolean;
  lockKey: string;
  holderId: string;
}

export async function acquireLock(
  adminClient: SupabaseClient,
  lockKey: string,
  holderId: string,
  ttlMs = DEFAULT_LOCK_TTL_MS,
): Promise<AcquireLockResult> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlMs).toISOString();

  await adminClient.from('distributed_locks').delete().lt('expires_at', now.toISOString());

  const { error } = await adminClient.from('distributed_locks').insert({
    lock_key: lockKey,
    holder_id: holderId,
    expires_at: expiresAt,
  });

  return { acquired: !error, lockKey, holderId };
}

export async function releaseLock(
  adminClient: SupabaseClient,
  lockKey: string,
  holderId: string,
): Promise<void> {
  await adminClient
    .from('distributed_locks')
    .delete()
    .eq('lock_key', lockKey)
    .eq('holder_id', holderId);
}

export async function withLock<T>(
  adminClient: SupabaseClient,
  lockKey: string,
  holderId: string,
  fn: () => Promise<T>,
): Promise<T> {
  const lock = await acquireLock(adminClient, lockKey, holderId);
  if (!lock.acquired) {
    throw new Error(`Could not acquire lock: ${lockKey}`);
  }

  try {
    return await fn();
  } finally {
    await releaseLock(adminClient, lockKey, holderId);
  }
}
