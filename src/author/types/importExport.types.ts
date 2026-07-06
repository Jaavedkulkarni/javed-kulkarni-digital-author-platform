import type { ExportFormat } from './common';

export interface ImportJob {
  id: string;
  authorId: string;
  type: 'books' | 'sales' | 'analytics';
  filename: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  rowCount: number;
  createdAt: string;
}

export interface ExportJob {
  id: string;
  authorId: string;
  type: 'royalties' | 'sales' | 'analytics' | 'payouts' | 'performance';
  format: ExportFormat;
  filename: string;
  columns: string[];
  rowCount: number;
  status: 'prepared' | 'ready' | 'expired';
  preparedAt: string;
  downloadPath: string | null;
}

export interface PrepareExportInput {
  authorId: string;
  type: ExportJob['type'];
  format?: ExportFormat;
}
