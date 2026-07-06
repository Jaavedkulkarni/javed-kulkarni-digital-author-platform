import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';
import { HEALTH_CHECK_TABLE, HEALTH_CHECK_TIMEOUT_MS } from '../supabase/config/constants';
import { normalizeSupabaseError } from './errors';
import { logger } from './logger';

export type ConnectionHealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface ConnectionHealthResult {
  status: ConnectionHealthStatus;
  latencyMs: number;
  message: string;
  checkedAt: string;
}

interface HealthQueryResult {
  error: { message: string } | null;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Health check timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error: unknown) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export async function checkSupabaseConnection(
  client: SupabaseClient<Database>
): Promise<ConnectionHealthResult> {
  const startedAt = Date.now();
  const checkedAt = new Date().toISOString();

  try {
    const queryPromise = client.from(HEALTH_CHECK_TABLE).select('id').limit(1);
    const result = await withTimeout(queryPromise as unknown as Promise<HealthQueryResult>, HEALTH_CHECK_TIMEOUT_MS);

    const latencyMs = Date.now() - startedAt;

    if (result.error) {
      logger.warn('health', `Connection check failed: ${result.error.message}`);
      return {
        status: 'degraded',
        latencyMs,
        message: result.error.message,
        checkedAt,
      };
    }

    return {
      status: 'healthy',
      latencyMs,
      message: 'Supabase connection is healthy.',
      checkedAt,
    };
  } catch (error) {
    const latencyMs = Date.now() - startedAt;
    const message = normalizeSupabaseError(error, 'network').message;

    logger.error('health', message);

    return {
      status: 'unhealthy',
      latencyMs,
      message,
      checkedAt,
    };
  }
}
