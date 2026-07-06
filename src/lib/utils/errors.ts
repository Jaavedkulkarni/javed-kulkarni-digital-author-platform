import type { AuthError, PostgrestError } from '@supabase/supabase-js';

export type SupabaseErrorSource = 'auth' | 'database' | 'storage' | 'realtime' | 'network' | 'unknown';

export interface SupabaseErrorDetails {
  source: SupabaseErrorSource;
  code?: string;
  message: string;
  hint?: string;
  details?: string;
  status?: number;
  cause?: unknown;
}

export class SupabaseServiceError extends Error {
  readonly source: SupabaseErrorSource;
  readonly code?: string;
  readonly hint?: string;
  readonly details?: string;
  readonly status?: number;
  readonly cause?: unknown;

  constructor(payload: SupabaseErrorDetails) {
    super(payload.message);
    this.name = 'SupabaseServiceError';
    this.source = payload.source;
    this.code = payload.code;
    this.hint = payload.hint;
    this.details = payload.details;
    this.status = payload.status;
    this.cause = payload.cause;
  }
}

export function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as PostgrestError).code === 'string' &&
    (error as PostgrestError).code.startsWith('PGRST')
  );
}

export function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error &&
    !isPostgrestError(error)
  );
}

export function isStorageError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'name' in error &&
    String((error as { name?: string }).name).includes('Storage')
  );
}

export function normalizeSupabaseError(
  error: unknown,
  source: SupabaseErrorSource = 'unknown'
): SupabaseServiceError {
  if (error instanceof SupabaseServiceError) {
    return error;
  }

  if (isPostgrestError(error)) {
    return new SupabaseServiceError({
      source: 'database',
      code: error.code,
      message: error.message,
      hint: error.hint ?? undefined,
      details: error.details ?? undefined,
      cause: error,
    });
  }

  if (isStorageError(error)) {
    const storageError = error as { message: string };
    return new SupabaseServiceError({
      source: 'storage',
      message: storageError.message,
      cause: error,
    });
  }

  if (isAuthError(error)) {
    return new SupabaseServiceError({
      source: 'auth',
      message: error.message,
      status: error.status,
      cause: error,
    });
  }

  if (error instanceof Error) {
    return new SupabaseServiceError({
      source,
      message: error.message,
      cause: error,
    });
  }

  return new SupabaseServiceError({
    source,
    message: 'An unknown Supabase error occurred.',
    cause: error,
  });
}

export function getErrorMessage(error: unknown): string {
  return normalizeSupabaseError(error).message;
}

export function isNotFoundError(error: unknown): boolean {
  const normalized = normalizeSupabaseError(error);
  return normalized.code === 'PGRST116';
}

export function isRetryableError(error: unknown): boolean {
  const normalized = normalizeSupabaseError(error);

  if (normalized.source === 'network') return true;

  if (normalized.status && normalized.status >= 500) return true;

  const retryableCodes = new Set(['PGRST301', '57014', '53300', '08006', '08001', '57P01']);
  return normalized.code ? retryableCodes.has(normalized.code) : false;
}
