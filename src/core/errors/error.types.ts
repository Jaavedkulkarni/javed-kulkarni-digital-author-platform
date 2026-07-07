export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export type ErrorDomain =
  | 'AUTH'
  | 'USER'
  | 'ROLE'
  | 'BOOK'
  | 'CMS'
  | 'ORDER'
  | 'PAYMENT'
  | 'SYSTEM'
  | 'STORAGE'
  | 'EDGE';

export interface ErrorCatalogEntry {
  code: string;
  domain: ErrorDomain;
  message: string;
  httpStatus: number;
  severity: ErrorSeverity;
  recoveryStrategy: string;
  documentationPath: string;
}

export interface ErrorContract {
  code: string;
  message: string;
  httpStatus: number;
  severity: ErrorSeverity;
  recoveryStrategy: string;
  documentationUrl: string;
  requestId?: string;
  details?: Record<string, unknown>;
}

export class CatalogError extends Error {
  readonly entry: ErrorCatalogEntry;
  readonly requestId?: string;
  readonly details?: Record<string, unknown>;

  constructor(entry: ErrorCatalogEntry, options?: { requestId?: string; details?: Record<string, unknown>; overrideMessage?: string }) {
    super(options?.overrideMessage ?? entry.message);
    this.name = 'CatalogError';
    this.entry = entry;
    this.requestId = options?.requestId;
    this.details = options?.details;
  }

  toContract(baseDocUrl = '/ERROR_CATALOG.md'): ErrorContract {
    return {
      code: this.entry.code,
      message: this.message,
      httpStatus: this.entry.httpStatus,
      severity: this.entry.severity,
      recoveryStrategy: this.entry.recoveryStrategy,
      documentationUrl: `${baseDocUrl}${this.entry.documentationPath}`,
      requestId: this.requestId,
      details: this.details,
    };
  }
}
