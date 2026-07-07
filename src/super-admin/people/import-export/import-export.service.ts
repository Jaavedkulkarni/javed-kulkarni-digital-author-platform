import { invokeEdgeFunctionOrThrow } from '../../../lib/edge-functions';
import { createIdempotencyKey } from '../../../enterprise/idempotency/idempotency-key';
import type {
  ExportScope,
  ExportUsersResponse,
  ImportExecuteResponse,
  ImportExportFormat,
  ImportPreviewResponse,
} from './import-export.types';

export class ImportExportService {
  previewImport(rows: Record<string, unknown>[], columnMapping?: Record<string, string>) {
    return invokeEdgeFunctionOrThrow<ImportPreviewResponse>(
      'import-users',
      { action: 'preview', rows, columnMapping },
      { idempotencyKey: createIdempotencyKey('import-users-preview') },
    );
  }

  executeImport(
    rows: Record<string, unknown>[],
    options?: { columnMapping?: Record<string, string>; partialImport?: boolean },
  ) {
    return invokeEdgeFunctionOrThrow<ImportExecuteResponse>(
      'import-users',
      {
        action: 'execute',
        rows,
        columnMapping: options?.columnMapping,
        partialImport: options?.partialImport ?? true,
        rollbackFailedOnly: true,
      },
      { idempotencyKey: createIdempotencyKey('import-users-execute') },
    );
  }

  getImportJobStatus(jobId: string) {
    return invokeEdgeFunctionOrThrow<ImportExecuteResponse & { status?: string; error?: string }>(
      'import-users',
      { action: 'job_status', jobId },
      { idempotencyKey: createIdempotencyKey('import-users-status') },
    );
  }

  exportUsers(params: {
    format: ImportExportFormat;
    scope: ExportScope;
    userIds?: string[];
    filters?: Record<string, unknown>;
    columns?: string[];
  }) {
    return invokeEdgeFunctionOrThrow<ExportUsersResponse>(
      'export-users',
      { action: 'export', ...params },
      { idempotencyKey: createIdempotencyKey('export-users') },
    );
  }

  getExportJobStatus(jobId: string) {
    return invokeEdgeFunctionOrThrow<ExportUsersResponse>(
      'export-users',
      { action: 'job_status', jobId },
      { idempotencyKey: createIdempotencyKey('export-users-status') },
    );
  }
}

let importExportService: ImportExportService | null = null;

export function getImportExportService(): ImportExportService {
  if (!importExportService) importExportService = new ImportExportService();
  return importExportService;
}
