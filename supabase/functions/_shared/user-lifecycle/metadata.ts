import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';

interface SuspensionMetadata {
  reason: string;
  notes?: string;
  suspendedAt: string;
  suspendedBy: string;
  effectiveImmediately: boolean;
}

async function readSecurityMetadata(
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

export async function writeSuspensionMetadata(
  adminClient: SupabaseClient,
  userId: string,
  actorId: string,
  input: { reason: string; notes?: string; effectiveImmediately: boolean },
): Promise<void> {
  const existing = await readSecurityMetadata(adminClient, userId);
  const suspension: SuspensionMetadata = {
    reason: input.reason,
    notes: input.notes,
    suspendedAt: new Date().toISOString(),
    suspendedBy: actorId,
    effectiveImmediately: input.effectiveImmediately,
  };

  const { error } = await adminClient.from('user_security').upsert({
    user_id: userId,
    metadata: { ...existing, suspension },
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}

export async function clearSuspensionMetadata(
  adminClient: SupabaseClient,
  userId: string,
  restoreNotes?: string,
): Promise<void> {
  const existing = await readSecurityMetadata(adminClient, userId);
  const { suspension: _removed, ...rest } = existing as Record<string, unknown> & {
    suspension?: SuspensionMetadata;
  };

  const restoredAt = new Date().toISOString();
  const metadata = {
    ...rest,
    last_restored_at: restoredAt,
    ...(restoreNotes ? { last_restore_notes: restoreNotes } : {}),
  };

  const { error } = await adminClient.from('user_security').upsert({
    user_id: userId,
    metadata,
    updated_at: restoredAt,
  });

  if (error) throw error;
}

interface DeletionMetadata {
  reason: string;
  notes?: string;
  deletedAt: string;
  deletedBy: string;
  previousStatus: string;
}

export async function writeDeletionMetadata(
  adminClient: SupabaseClient,
  userId: string,
  actorId: string,
  input: { reason: string; notes?: string; previousStatus: string },
  deletedAt: string,
): Promise<void> {
  const existing = await readSecurityMetadata(adminClient, userId);
  const deletion: DeletionMetadata = {
    reason: input.reason,
    notes: input.notes,
    deletedAt,
    deletedBy: actorId,
    previousStatus: input.previousStatus,
  };

  const { error } = await adminClient.from('user_security').upsert({
    user_id: userId,
    metadata: { ...existing, deletion },
    deleted_at: deletedAt,
    updated_at: deletedAt,
  });

  if (error) throw error;
}

export async function readDeletionPreviousStatus(
  adminClient: SupabaseClient,
  userId: string,
): Promise<string> {
  const existing = await readSecurityMetadata(adminClient, userId);
  const deletion = existing.deletion as DeletionMetadata | undefined;
  const status = deletion?.previousStatus?.trim();
  if (status && status !== 'deleted') return status;
  return 'active';
}

export async function clearDeletionMetadata(
  adminClient: SupabaseClient,
  userId: string,
  recoverNotes?: string,
): Promise<void> {
  const existing = await readSecurityMetadata(adminClient, userId);
  const { deletion: _removed, ...rest } = existing as Record<string, unknown> & {
    deletion?: DeletionMetadata;
  };

  const recoveredAt = new Date().toISOString();
  const metadata = {
    ...rest,
    last_recovered_at: recoveredAt,
    ...(recoverNotes ? { last_recover_notes: recoverNotes } : {}),
  };

  const { error } = await adminClient.from('user_security').upsert({
    user_id: userId,
    metadata,
    deleted_at: null,
    updated_at: recoveredAt,
  });

  if (error) throw error;
}
