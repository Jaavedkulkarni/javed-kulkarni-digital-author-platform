import { ARCHITECTURE_VERSION } from '../constants';

export const API_VERSIONS = ['v1'] as const;
export type ApiVersion = (typeof API_VERSIONS)[number];

export const CURRENT_API_VERSION: ApiVersion = 'v1';

export interface VersionedContract<TPayload = Record<string, unknown>> {
  version: ApiVersion;
  payload: TPayload;
}

export interface VersionedEdgeFunctionContract<TRequest, TResponse> {
  version: ApiVersion;
  functionName: string;
  request: TRequest;
  response: TResponse;
}

export function createVersionedPayload<T>(payload: T, version: ApiVersion = CURRENT_API_VERSION): VersionedContract<T> {
  return { version, payload };
}

export function assertApiVersion(version: string): version is ApiVersion {
  return API_VERSIONS.includes(version as ApiVersion);
}

export function getVersionHeader(version: ApiVersion = CURRENT_API_VERSION): Record<string, string> {
  return { 'x-api-version': version };
}

export function wrapApiResponse<T>(data: T, requestId?: string): {
  success: true;
  data: T;
  version: string;
  requestId?: string;
} {
  return {
    success: true,
    data,
    version: ARCHITECTURE_VERSION,
    requestId,
  };
}

export function versionedEdgePath(functionName: string, version: ApiVersion = CURRENT_API_VERSION): string {
  return `/functions/${version}/${functionName}`;
}

export function versionedEventEnvelope<T extends Record<string, unknown>>(
  type: string,
  payload: T,
  version: ApiVersion = CURRENT_API_VERSION,
): { type: string; version: ApiVersion; payload: T; coreVersion: string } {
  return {
    type,
    version,
    payload,
    coreVersion: ARCHITECTURE_VERSION,
  };
}

export function parseRequestedApiVersion(headerValue: string | null): ApiVersion {
  if (headerValue && assertApiVersion(headerValue)) return headerValue;
  return CURRENT_API_VERSION;
}
