import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import { RateLimitError } from '../errors/app-error.ts';
import type { RequestContext } from '../request-context/context.ts';
import type { Logger } from '../logging/logger.ts';

export interface RateLimitRule {
  scope: 'endpoint' | 'ip' | 'user' | 'role';
  limit: number;
  windowSeconds: number;
}

export interface RateLimitConfig {
  default: RateLimitRule[];
  overrides?: Record<string, RateLimitRule[]>;
}

export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  default: [
    { scope: 'endpoint', limit: 120, windowSeconds: 60 },
    { scope: 'ip', limit: 60, windowSeconds: 60 },
    { scope: 'user', limit: 30, windowSeconds: 60 },
  ],
  overrides: {
    'create-user': [
      { scope: 'endpoint', limit: 20, windowSeconds: 60 },
      { scope: 'user', limit: 10, windowSeconds: 60 },
    ],
    'upload-avatar': [
      { scope: 'endpoint', limit: 30, windowSeconds: 60 },
      { scope: 'user', limit: 15, windowSeconds: 60 },
    ],
  },
};

function windowStart(windowSeconds: number): string {
  const now = Date.now();
  const bucket = Math.floor(now / (windowSeconds * 1000)) * windowSeconds * 1000;
  return new Date(bucket).toISOString();
}

function scopeKey(scope: RateLimitRule['scope'], context: RequestContext, endpoint: string): string | null {
  switch (scope) {
    case 'endpoint':
      return endpoint;
    case 'ip':
      return context.ip ?? 'unknown';
    case 'user':
      return context.actorId ?? 'anonymous';
    case 'role':
      return context.actorRole ?? 'anonymous';
    default:
      return null;
  }
}

export async function enforceRateLimit(
  adminClient: SupabaseClient,
  context: RequestContext,
  endpoint: string,
  config: RateLimitConfig,
  logger: Logger,
): Promise<void> {
  const rules = config.overrides?.[endpoint] ?? config.default;

  for (const rule of rules) {
    const key = scopeKey(rule.scope, context, endpoint);
    if (!key) continue;

    const scope = `${rule.scope}:${endpoint}`;
    const start = windowStart(rule.windowSeconds);

    const { data: existing, error: readError } = await adminClient
      .from('rate_limit_counters')
      .select('id, request_count')
      .eq('scope', scope)
      .eq('scope_key', key)
      .eq('window_start', start)
      .maybeSingle();

    if (readError) {
      logger.warn('Rate limit read failed', { message: readError.message });
      continue;
    }

    if (existing && existing.request_count >= rule.limit) {
      throw new RateLimitError(rule.windowSeconds);
    }

    if (existing) {
      await adminClient
        .from('rate_limit_counters')
        .update({ request_count: existing.request_count + 1 })
        .eq('id', existing.id);
    } else {
      await adminClient.from('rate_limit_counters').insert({
        scope,
        scope_key: key,
        window_start: start,
        request_count: 1,
      });
    }
  }
}

export function rateLimitHeaders(retryAfterSeconds?: number): Record<string, string> {
  if (!retryAfterSeconds) return {};
  return { 'Retry-After': String(retryAfterSeconds) };
}
