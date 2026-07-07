export type ImportExportFormat = 'csv' | 'xlsx' | 'pdf';

export type ExportScope = 'selected' | 'filtered' | 'all' | 'visible';

export interface ImportPreviewSummary {
  total: number;
  valid: number;
  invalid: number;
  duplicates: number;
  imported?: number;
  failed?: number;
  skipped?: number;
}

export interface ImportRowResult {
  rowIndex: number;
  email: string;
  status: 'valid' | 'invalid' | 'duplicate' | 'imported' | 'failed' | 'skipped';
  reason?: string;
  userId?: string;
}

export interface ImportPreviewResponse {
  preview?: boolean;
  summary: ImportPreviewSummary;
  results: ImportRowResult[];
  columns: string[];
}

export interface ImportExecuteResponse {
  importBatchId?: string;
  async?: boolean;
  jobId?: string;
  summary: ImportPreviewSummary;
  results: ImportRowResult[];
}

export interface ExportUsersResponse {
  async?: boolean;
  jobId?: string;
  format?: ImportExportFormat;
  columns?: string[];
  rows?: Record<string, unknown>[];
  rowCount?: number;
  status?: string;
  error?: string;
}

export const IMPORT_TEMPLATE_COLUMNS = [
  'email',
  'firstName',
  'lastName',
  'phone',
  'role',
  'status',
  'country',
  'timezone',
] as const;

export const EXPORT_COLUMN_OPTIONS = [
  { id: 'id', label: 'User ID' },
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'primaryRole', label: 'Role' },
  { id: 'status', label: 'Status' },
  { id: 'emailVerified', label: 'Verified' },
  { id: 'lastLogin', label: 'Last Login' },
  { id: 'createdAt', label: 'Created' },
  { id: 'country', label: 'Country' },
  { id: 'timezone', label: 'Timezone' },
] as const;
