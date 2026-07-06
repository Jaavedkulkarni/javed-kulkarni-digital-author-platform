import { isRetryableError, normalizeSupabaseError } from './errors';
import { logger } from './logger';

export interface RetryOptions {
  attempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  scope?: string;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function computeBackoff(attempt: number, baseDelayMs: number, maxDelayMs: number): number {
  const exponential = baseDelayMs * 2 ** (attempt - 1);
  const jitter = Math.random() * 100;
  return Math.min(exponential + jitter, maxDelayMs);
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    attempts = 3,
    baseDelayMs = 300,
    maxDelayMs = 5000,
    scope = 'retry',
    shouldRetry = isRetryableError,
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const isLastAttempt = attempt === attempts;
      const retry = !isLastAttempt && shouldRetry(error, attempt);

      logger.warn(
        scope,
        `Operation failed (attempt ${attempt}/${attempts}): ${normalizeSupabaseError(error).message}`
      );

      if (!retry) break;

      const waitMs = computeBackoff(attempt, baseDelayMs, maxDelayMs);
      await delay(waitMs);
    }
  }

  throw lastError;
}

export default withRetry;
