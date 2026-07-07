import { AppError, InternalError, toAppError } from './app-error.ts';

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiFailureResponse {
  success: false;
  error: ApiErrorBody;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiFailureResponse;

export function jsonResponse(body: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

export function jsonSuccess<T>(data: T, headers: HeadersInit = {}): Response {
  const body: ApiSuccessResponse<T> = { success: true, data };
  return jsonResponse(body, 200, headers);
}

export function jsonFailure(error: AppError, headers: HeadersInit = {}): Response {
  const body: ApiFailureResponse = {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    },
  };
  return jsonResponse(body, error.status, headers);
}

export function jsonFromError(error: unknown, headers: HeadersInit = {}): Response {
  const appError = toAppError(error);
  if (!(error instanceof AppError)) {
    return jsonFailure(new InternalError(appError.message), headers);
  }
  return jsonFailure(appError, headers);
}

export function methodNotAllowed(headers: HeadersInit = {}): Response {
  return jsonFailure(new AppError('METHOD_NOT_ALLOWED', 'Method not allowed', 405), headers);
}
