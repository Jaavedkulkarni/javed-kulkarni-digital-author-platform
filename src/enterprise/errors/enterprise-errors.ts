import {
  CatalogError,
  ERROR_CATALOG,
  createCatalogError,
  resolveErrorContract,
  mapHttpStatusToCatalogCode,
  isCatalogErrorCode,
  type ErrorContract,
  type ErrorCatalogEntry,
  type ErrorSeverity,
  type ErrorDomain,
  type ErrorCatalogCode,
} from '../../core/errors';

export {
  CatalogError,
  ERROR_CATALOG,
  createCatalogError,
  resolveErrorContract,
  mapHttpStatusToCatalogCode,
  isCatalogErrorCode,
  type ErrorContract,
  type ErrorCatalogEntry,
  type ErrorSeverity,
  type ErrorDomain,
  type ErrorCatalogCode,
};

/** @deprecated Use CatalogError from @/core/errors */
export class EnterpriseError extends CatalogError {
  constructor(message: string, code: ErrorCatalogCode = 'SYSTEM_003') {
    super(ERROR_CATALOG[code], { overrideMessage: message });
    this.name = 'EnterpriseError';
  }
}

export function toFriendlyEnterpriseMessage(error: unknown): string {
  if (error instanceof CatalogError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return ERROR_CATALOG.SYSTEM_003.message;
}

export function isEnterpriseError(error: unknown): error is CatalogError {
  return error instanceof CatalogError;
}
