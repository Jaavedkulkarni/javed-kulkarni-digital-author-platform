export { createIdempotencyKey } from '../temp-password/temp-password';

export const IDEMPOTENCY_KEY_HEADER = 'idempotency-key';

export interface IdempotencyOptions {
  key?: string;
  prefix?: string;
}

export function resolveIdempotencyKey(options: IdempotencyOptions = {}): string {
  if (options.key) return options.key;
  return `${options.prefix ?? 'idem'}_${crypto.randomUUID()}`;
}
