import { getBrowserClient } from '../supabase/clients/browser';
import { ERROR_CATALOG, type ErrorCatalogCode } from '../../core/errors';
import { getVersionHeader } from '../../core/versioning';
import { REQUEST_HEADERS } from '../../core/constants/system.constants';
import { EdgeFunctionInvokeError } from './errors';
import type { EdgeFunctionResponse } from './types';
import { isEdgeFunctionFailure } from './types';
import {
  buildEnterpriseRequestHeaders,
  type RequestContext,
} from '../../enterprise/request-context/request-context';

export interface InvokeEdgeFunctionOptions {
  requestContext?: Partial<RequestContext>;
  idempotencyKey?: string;
  apiVersion?: string;
}

function resolveCatalogCode(code: string): ErrorCatalogCode {
  if (code in ERROR_CATALOG) return code as ErrorCatalogCode;
  return 'EDGE_001';
}

export async function invokeEdgeFunction<TResponse>(
  functionName: string,
  body?: Record<string, unknown>,
  options: InvokeEdgeFunctionOptions = {},
): Promise<EdgeFunctionResponse<TResponse>> {
  const supabase = getBrowserClient();
  const headers = {
    ...buildEnterpriseRequestHeaders(options.requestContext, options.idempotencyKey),
    ...getVersionHeader(),
    ...(options.apiVersion ? { [REQUEST_HEADERS.apiVersion]: options.apiVersion } : {}),
  };

  const { data, error } = await supabase.functions.invoke(functionName, { body, headers });

  if (error) {
    throw error;
  }

  if (!data || typeof data !== 'object') {
    throw new EdgeFunctionInvokeError(ERROR_CATALOG.EDGE_001.message, 'EDGE_001');
  }

  const response = data as EdgeFunctionResponse<TResponse>;

  if ('success' in response && (response.success === false || response.success === true)) {
    return response;
  }

  throw new EdgeFunctionInvokeError(ERROR_CATALOG.EDGE_001.message, 'EDGE_001');
}

export async function invokeEdgeFunctionOrThrow<TResponse>(
  functionName: string,
  body?: Record<string, unknown>,
  options?: InvokeEdgeFunctionOptions,
): Promise<TResponse> {
  const response = await invokeEdgeFunction<TResponse>(functionName, body, options);

  if (isEdgeFunctionFailure(response)) {
    throw new EdgeFunctionInvokeError(
      response.error.message,
      resolveCatalogCode(response.error.code),
    );
  }

  return response.data;
}
