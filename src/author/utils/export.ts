import type { ExportFormat } from '../types/common';
import type { ExportJob } from '../types/importExport.types';

export function prepareExportFile(params: {
  authorId: string;
  type: ExportJob['type'];
  format: ExportFormat;
  columns: string[];
  rowCount: number;
}): { filename: string; mimeType: string } {
  const ext = params.format === 'xlsx' ? 'xlsx' : params.format === 'pdf' ? 'pdf' : 'csv';
  const filename = `author-${params.type}-${params.authorId}-${Date.now()}.${ext}`;
  const mimeType =
    params.format === 'xlsx'
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : params.format === 'pdf'
        ? 'application/pdf'
        : 'text/csv';

  return { filename, mimeType };
}

export const EXPORT_COLUMNS: Record<ExportJob['type'], string[]> = {
  royalties: ['bookTitle', 'grossAmount', 'royaltyAmount', 'status', 'periodMonth', 'periodYear'],
  sales: ['bookTitle', 'unitsSold', 'grossRevenue', 'netRoyalty', 'period'],
  analytics: ['bookTitle', 'reads', 'revenue', 'conversionRate', 'downloads'],
  payouts: ['amount', 'status', 'method', 'initiatedAt', 'completedAt'],
  performance: ['bookTitle', 'reads', 'revenue', 'completionRate', 'trendDirection'],
};
