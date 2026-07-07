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
};

export interface RateLimitExceededError extends Error {
  retryAfter: number;
}

export function createRateLimitExceededError(retryAfterSeconds: number): RateLimitExceededError {
  const error = new Error('Too many requests. Please try again later.') as RateLimitExceededError;
  error.name = 'RateLimitExceededError';
  error.retryAfter = retryAfterSeconds;
  return error;
}
