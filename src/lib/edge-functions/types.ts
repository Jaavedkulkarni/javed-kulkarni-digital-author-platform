export interface EdgeFunctionErrorBody {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface EdgeFunctionFailureResponse {
  success: false;
  error: EdgeFunctionErrorBody;
}

export interface EdgeFunctionSuccessResponse<T> {
  success: true;
  data: T;
}

export type EdgeFunctionResponse<T> = EdgeFunctionSuccessResponse<T> | EdgeFunctionFailureResponse;

export function isEdgeFunctionFailure<T>(
  response: EdgeFunctionResponse<T>,
): response is EdgeFunctionFailureResponse {
  return response.success === false;
}

export function isEdgeFunctionSuccess<T>(
  response: EdgeFunctionResponse<T>,
): response is EdgeFunctionSuccessResponse<T> {
  return response.success === true;
}
