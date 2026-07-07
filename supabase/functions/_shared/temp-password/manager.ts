import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';

const DEFAULT_TEMP_PASSWORD_TTL_HOURS = 72;
const PASSWORD_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';

export interface TempPasswordMetadata {
  tempPasswordActive: boolean;
  tempPasswordExpiresAt: string | null;
  tempPasswordCreatedAt: string | null;
  tempPasswordCreatedBy: string | null;
  forcePasswordChange: boolean;
  firstLoginRequired: boolean;
  passwordRotationDueAt: string | null;
}

export function generateTemporaryPassword(length = 16): string {
  const values = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(values, (v) => PASSWORD_CHARS[v % PASSWORD_CHARS.length]).join('');
}

export async function setTemporaryPasswordMetadata(
  adminClient: SupabaseClient,
  userId: string,
  createdBy: string,
  options: {
    forcePasswordChange?: boolean;
    firstLoginRequired?: boolean;
    ttlHours?: number;
  } = {},
): Promise<TempPasswordMetadata> {
  const now = new Date();
  const ttlHours = options.ttlHours ?? DEFAULT_TEMP_PASSWORD_TTL_HOURS;
  const expiresAt = new Date(now.getTime() + ttlHours * 60 * 60 * 1000).toISOString();

  const record: TempPasswordMetadata = {
    tempPasswordActive: true,
    tempPasswordExpiresAt: expiresAt,
    tempPasswordCreatedAt: now.toISOString(),
    tempPasswordCreatedBy: createdBy,
    forcePasswordChange: options.forcePasswordChange ?? true,
    firstLoginRequired: options.firstLoginRequired ?? true,
    passwordRotationDueAt: null,
  };

  const { error } = await adminClient.from('user_security').upsert({
    user_id: userId,
    temp_password_active: record.tempPasswordActive,
    temp_password_expires_at: record.tempPasswordExpiresAt,
    temp_password_created_at: record.tempPasswordCreatedAt,
    temp_password_created_by: record.tempPasswordCreatedBy,
    force_password_change: record.forcePasswordChange,
    first_login_required: record.firstLoginRequired,
    updated_at: now.toISOString(),
  });

  if (error) throw error;
  return record;
}

export async function clearTemporaryPasswordMetadata(
  adminClient: SupabaseClient,
  userId: string,
): Promise<void> {
  const { error } = await adminClient.from('user_security').upsert({
    user_id: userId,
    temp_password_active: false,
    temp_password_expires_at: null,
    force_password_change: false,
    first_login_required: false,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}

export async function getTemporaryPasswordStatus(
  adminClient: SupabaseClient,
  userId: string,
): Promise<TempPasswordMetadata | null> {
  const { data, error } = await adminClient
    .from('user_security')
    .select(
      'temp_password_active, temp_password_expires_at, temp_password_created_at, temp_password_created_by, force_password_change, first_login_required, password_rotation_due_at',
    )
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return null;

  const expired =
    data.temp_password_expires_at &&
    new Date(data.temp_password_expires_at).getTime() < Date.now();

  return {
    tempPasswordActive: data.temp_password_active && !expired,
    tempPasswordExpiresAt: data.temp_password_expires_at,
    tempPasswordCreatedAt: data.temp_password_created_at,
    tempPasswordCreatedBy: data.temp_password_created_by,
    forcePasswordChange: data.force_password_change,
    firstLoginRequired: data.first_login_required,
    passwordRotationDueAt: data.password_rotation_due_at,
  };
}

export function isTemporaryPasswordExpired(metadata: TempPasswordMetadata): boolean {
  if (!metadata.tempPasswordExpiresAt) return false;
  return new Date(metadata.tempPasswordExpiresAt).getTime() < Date.now();
}
