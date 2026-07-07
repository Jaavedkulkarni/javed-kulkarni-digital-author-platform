import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import { AppError } from '../errors/app-error.ts';
import type { Logger } from '../logging/logger.ts';

const IDEMPOTENCY_HEADER = 'idempotency-key';
const DEFAULT_TTL_HOURS = 24;

export function getIdempotencyKey(req: Request): string | null {
  return req.headers.get(IDEMPOTENCY_HEADER)?.trim() ?? null;
}

async function hashRequest(body: unknown): Promise<string> {
  const encoded = new TextEncoder().encode(JSON.stringify(body ?? {}));
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export interface IdempotencyResult {
  replay: boolean;
  responseStatus: number;
  responseBody: unknown;
}

export async function checkIdempotency(
  adminClient: SupabaseClient,
  functionName: string,
  req: Request,
  body: unknown,
  actorId: string | null,
  logger: Logger,
): Promise<IdempotencyResult | null> {
  const key = getIdempotencyKey(req);
  if (!key) return null;

  const requestHash = await hashRequest(body);
  const { data, error } = await adminClient
    .from('idempotency_keys')
    .select('request_hash, response_status, response_body')
    .eq('key', key)
    .eq('function_name', functionName)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (error) {
    logger.warn('Idempotency lookup failed', { message: error.message });
    return null;
  }

  if (data) {
    if (data.request_hash !== requestHash) {
      throw new AppError('CONFLICT', 'Idempotency key reused with different payload', 409);
    }
    return {
      replay: true,
      responseStatus: data.response_status,
      responseBody: data.response_body,
    };
  }

  return { replay: false, responseStatus: 0, responseBody: null };
}

export async function storeIdempotencyResult(
  adminClient: SupabaseClient,
  functionName: string,
  req: Request,
  body: unknown,
  actorId: string | null,
  responseStatus: number,
  responseBody: unknown,
  logger: Logger,
): Promise<void> {
  const key = getIdempotencyKey(req);
  if (!key) return;

  const requestHash = await hashRequest(body);
  const expiresAt = new Date(Date.now() + DEFAULT_TTL_HOURS * 60 * 60 * 1000).toISOString();

  const { error } = await adminClient.from('idempotency_keys').insert({
    key,
    function_name: functionName,
    actor_id: actorId,
    request_hash: requestHash,
    response_status: responseStatus,
    response_body: responseBody,
    expires_at: expiresAt,
  });

  if (error) {
    logger.warn('Failed to store idempotency result', { message: error.message });
  }
}

export { IDEMPOTENCY_HEADER };
