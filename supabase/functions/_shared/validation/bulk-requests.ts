import { ConflictError, NotFoundError, ValidationError } from '../errors/app-error.ts';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

const BULK_OPERATIONS = new Set([
  'suspend',
  'restore',
  'delete',
  'recover',
  'assign_role',
  'remove_role',
  'force_password_reset',
  'send_verification',
  'send_invite',
  'bulk_edit',
]);

const BULK_ACTIONS = new Set(['execute', 'job_status', 'cancel_job']);

export interface BulkUsersRequest {
  action: 'execute' | 'job_status' | 'cancel_job';
  operation?: string;
  userIds?: string[];
  payload?: Record<string, unknown>;
  jobId?: string;
}

export function validateBulkUsersRequest(body: unknown): BulkUsersRequest {
  if (!body || typeof body !== 'object') throw new ValidationError('Request body is required');
  const input = body as Record<string, unknown>;
  if (!isNonEmptyString(input.action) || !BULK_ACTIONS.has(input.action)) {
    throw new ValidationError('Invalid bulk action');
  }

  const request: BulkUsersRequest = { action: input.action as BulkUsersRequest['action'] };

  if (input.action === 'execute') {
    if (!isNonEmptyString(input.operation) || !BULK_OPERATIONS.has(input.operation)) {
      throw new ValidationError('Invalid bulk operation');
    }
    if (!Array.isArray(input.userIds) || input.userIds.length === 0) {
      throw new ValidationError('userIds array is required');
    }
    request.operation = input.operation.trim();
    request.userIds = input.userIds.map((id) => String(id).trim()).filter(Boolean);
    request.payload = typeof input.payload === 'object' && input.payload ? input.payload as Record<string, unknown> : {};
  }

  if (input.action === 'job_status' || input.action === 'cancel_job') {
    if (!isNonEmptyString(input.jobId)) throw new ValidationError('jobId is required');
    request.jobId = input.jobId.trim();
  }

  return request;
}

const IMPORT_ACTIONS = new Set(['preview', 'execute', 'rollback', 'template', 'job_status']);

export interface ImportUsersRequest {
  action: 'preview' | 'execute' | 'rollback' | 'template' | 'job_status';
  rows?: Record<string, unknown>[];
  columnMapping?: Record<string, string>;
  partialImport?: boolean;
  rollbackFailedOnly?: boolean;
  jobId?: string;
  importBatchId?: string;
}

export function validateImportUsersRequest(body: unknown): ImportUsersRequest {
  if (!body || typeof body !== 'object') throw new ValidationError('Request body is required');
  const input = body as Record<string, unknown>;
  if (!isNonEmptyString(input.action) || !IMPORT_ACTIONS.has(input.action)) {
    throw new ValidationError('Invalid import action');
  }

  const request: ImportUsersRequest = { action: input.action as ImportUsersRequest['action'] };

  if (input.action === 'preview' || input.action === 'execute') {
    if (!Array.isArray(input.rows) || input.rows.length === 0) {
      throw new ValidationError('rows array is required');
    }
    request.rows = input.rows as Record<string, unknown>[];
    request.columnMapping = typeof input.columnMapping === 'object' && input.columnMapping
      ? input.columnMapping as Record<string, string>
      : undefined;
    request.partialImport = input.partialImport === true;
    request.rollbackFailedOnly = input.rollbackFailedOnly === true;
  }

  if (input.action === 'rollback') {
    if (!isNonEmptyString(input.importBatchId)) throw new ValidationError('importBatchId is required');
    request.importBatchId = input.importBatchId.trim();
    request.rollbackFailedOnly = input.rollbackFailedOnly === true;
  }

  if (input.action === 'job_status') {
    if (!isNonEmptyString(input.jobId)) throw new ValidationError('jobId is required');
    request.jobId = input.jobId.trim();
  }

  return request;
}

const EXPORT_FORMATS = new Set(['csv', 'xlsx', 'pdf']);
const EXPORT_SCOPES = new Set(['selected', 'filtered', 'all', 'visible']);

export interface ExportUsersRequest {
  action: 'export' | 'job_status';
  format?: 'csv' | 'xlsx' | 'pdf';
  scope?: 'selected' | 'filtered' | 'all' | 'visible';
  userIds?: string[];
  filters?: Record<string, unknown>;
  columns?: string[];
  jobId?: string;
}

export function validateExportUsersRequest(body: unknown): ExportUsersRequest {
  if (!body || typeof body !== 'object') throw new ValidationError('Request body is required');
  const input = body as Record<string, unknown>;
  const action = isNonEmptyString(input.action) ? input.action.trim() : 'export';

  if (action === 'job_status') {
    if (!isNonEmptyString(input.jobId)) throw new ValidationError('jobId is required');
    return { action: 'job_status', jobId: input.jobId.trim() };
  }

  const format = isNonEmptyString(input.format) ? input.format.trim() : 'csv';
  const scope = isNonEmptyString(input.scope) ? input.scope.trim() : 'filtered';
  if (!EXPORT_FORMATS.has(format)) throw new ValidationError('Invalid export format');
  if (!EXPORT_SCOPES.has(scope)) throw new ValidationError('Invalid export scope');

  return {
    action: 'export',
    format: format as ExportUsersRequest['format'],
    scope: scope as ExportUsersRequest['scope'],
    userIds: Array.isArray(input.userIds) ? input.userIds.map(String) : undefined,
    filters: typeof input.filters === 'object' && input.filters ? input.filters as Record<string, unknown> : undefined,
    columns: Array.isArray(input.columns) ? input.columns.map(String) : undefined,
  };
}

export function assertImportRowLimit(rows: unknown[], max = 5000): void {
  if (rows.length > max) throw new ConflictError(`Import exceeds maximum of ${max} rows`);
}
