export interface TemporaryPasswordMetadata {
  active: boolean;
  expiresAt: string | null;
  createdAt: string | null;
  createdBy: string | null;
  forcePasswordChange: boolean;
  firstLoginRequired: boolean;
  passwordRotationDueAt: string | null;
}

export interface TemporaryPasswordStatus extends TemporaryPasswordMetadata {
  expired: boolean;
}

const PASSWORD_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';

export function generateTemporaryPassword(length = 16): string {
  const values = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(values, (v) => PASSWORD_CHARS[v % PASSWORD_CHARS.length]).join('');
}

export function isTemporaryPasswordExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() < Date.now();
}

export function buildTemporaryPasswordStatus(
  metadata: TemporaryPasswordMetadata,
): TemporaryPasswordStatus {
  const expired = isTemporaryPasswordExpired(metadata.expiresAt);
  return {
    ...metadata,
    active: metadata.active && !expired,
    expired,
  };
}

export async function copyTemporaryPasswordToClipboard(password: string): Promise<void> {
  if (!navigator.clipboard) {
    throw new Error('Clipboard API is not available');
  }
  await navigator.clipboard.writeText(password);
}

export function createIdempotencyKey(prefix = 'idem'): string {
  return `${prefix}_${crypto.randomUUID()}`;
}
