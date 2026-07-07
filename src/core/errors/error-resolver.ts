import { ERROR_CATALOG, type ErrorCatalogCode } from './error-catalog';
import { CatalogError, type ErrorCatalogEntry, type ErrorContract } from './error.types';

export function getErrorEntry(code: ErrorCatalogCode): ErrorCatalogEntry {
  return ERROR_CATALOG[code];
}

export function createCatalogError(
  code: ErrorCatalogCode,
  options?: { requestId?: string; details?: Record<string, unknown>; overrideMessage?: string },
): CatalogError {
  return new CatalogError(ERROR_CATALOG[code], options);
}

export function resolveErrorContract(
  code: ErrorCatalogCode,
  baseDocUrl = '/ERROR_CATALOG.md',
  options?: { requestId?: string; details?: Record<string, unknown>; overrideMessage?: string },
): ErrorContract {
  return createCatalogError(code, options).toContract(baseDocUrl);
}

export function mapHttpStatusToCatalogCode(status: number): ErrorCatalogCode {
  switch (status) {
    case 400:
      return 'SYSTEM_001';
    case 401:
      return 'AUTH_001';
    case 403:
      return 'ROLE_001';
    case 404:
      return 'USER_001';
    case 409:
      return 'USER_002';
    case 429:
      return 'SYSTEM_002';
    case 502:
      return 'EDGE_001';
    default:
      return 'SYSTEM_003';
  }
}

export function isCatalogErrorCode(value: string): value is ErrorCatalogCode {
  return value in ERROR_CATALOG;
}
