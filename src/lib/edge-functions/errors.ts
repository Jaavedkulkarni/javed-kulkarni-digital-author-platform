import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from '@supabase/supabase-js';
import { createCatalogError, mapHttpStatusToCatalogCode, type ErrorCatalogCode } from '../../core/errors';
import type { EdgeFunctionFailureResponse } from './types';

export class EdgeFunctionInvokeError extends Error {
  readonly code: ErrorCatalogCode;

  constructor(message: string, code: ErrorCatalogCode = 'EDGE_001') {
    super(message);
    this.name = 'EdgeFunctionInvokeError';
    this.code = code;
  }
}

const DEFAULT_MESSAGE = createCatalogError('SYSTEM_003').message;

async function readHttpErrorMessage(error: FunctionsHttpError): Promise<string> {
  try {
    const payload = (await error.context.json()) as
      | EdgeFunctionFailureResponse
      | { error?: string; message?: string; code?: string };

    if (payload && typeof payload === 'object' && 'success' in payload && payload.success === false) {
      return payload.error.message;
    }
    if (payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string') {
      return payload.message;
    }
    if (payload && typeof payload === 'object' && 'error' in payload && typeof payload.error === 'string') {
      return payload.error;
    }
  } catch {
    // fall through
  }
  return error.message || DEFAULT_MESSAGE;
}

export async function mapEdgeFunctionInvokeError(error: unknown): Promise<string> {
  if (error instanceof EdgeFunctionInvokeError) {
    return error.message;
  }

  if (error instanceof FunctionsHttpError) {
    return readHttpErrorMessage(error);
  }

  if (error instanceof FunctionsRelayError) {
    return error.message || createCatalogError('EDGE_001').message;
  }

  if (error instanceof FunctionsFetchError) {
    return createCatalogError('EDGE_001', {
      overrideMessage: 'Unable to reach the server. Check your connection and try again.',
    }).message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return DEFAULT_MESSAGE;
}

export function mapEdgeFunctionErrorCode(error: unknown): ErrorCatalogCode {
  if (error instanceof EdgeFunctionInvokeError) {
    return error.code;
  }
  if (error instanceof FunctionsHttpError) {
    return mapHttpStatusToCatalogCode(error.context.status || 502);
  }
  return 'SYSTEM_003';
}

export { createCatalogError, mapHttpStatusToCatalogCode };
