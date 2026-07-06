import type { ImportJob, ExportJob } from '../types/importExport.types';
import type { ExportFormat } from '../types/common';

const imports = new Map<string, ImportJob[]>();
const exports = new Map<string, ExportJob[]>();

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getImportJobs(authorId: string): ImportJob[] {
  return imports.get(authorId) ?? [];
}

export function queueImport(authorId: string, type: ImportJob['type'], filename: string): ImportJob {
  const job: ImportJob = {
    id: createId('imp'),
    authorId,
    type,
    filename,
    status: 'queued',
    rowCount: 0,
    createdAt: new Date().toISOString(),
  };
  imports.set(authorId, [...getImportJobs(authorId), job]);
  return job;
}

export function getExportJobs(authorId: string): ExportJob[] {
  return exports.get(authorId) ?? [];
}

export function createExportJob(params: {
  authorId: string;
  type: ExportJob['type'];
  format: ExportFormat;
  filename: string;
  columns: string[];
  rowCount: number;
}): ExportJob {
  const job: ExportJob = {
    id: createId('exp'),
    authorId: params.authorId,
    type: params.type,
    format: params.format,
    filename: params.filename,
    columns: params.columns,
    rowCount: params.rowCount,
    status: 'prepared',
    preparedAt: new Date().toISOString(),
    downloadPath: `exports/${params.authorId}/${params.filename}`,
  };
  exports.set(params.authorId, [...getExportJobs(params.authorId), job]);
  return job;
}

export function resetImportExportStore(): void {
  imports.clear();
  exports.clear();
}
