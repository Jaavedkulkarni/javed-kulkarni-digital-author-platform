import type { ExportFormat } from '../types/common';
import type { ExportJob, ImportJob, PrepareExportInput } from '../types/importExport.types';
import { queueImport, createExportJob, getImportJobs, getExportJobs } from '../stores/importExportStore';
import { EXPORT_COLUMNS, prepareExportFile } from '../utils/export';
import type { AuthorRevenueService } from './revenueService';
import type { EarningsPayoutsService } from './earningsPayoutsService';
import type { BookPerformanceService } from './bookPerformanceService';
import type { AuthorAnalyticsService } from './analyticsService';

export class ImportExportService {
  constructor(
    private readonly revenue: AuthorRevenueService,
    private readonly earnings: EarningsPayoutsService,
    private readonly performance: BookPerformanceService,
    private readonly analytics: AuthorAnalyticsService
  ) {}

  queueImport(authorId: string, type: ImportJob['type'], filename: string): ImportJob {
    return queueImport(authorId, type, filename);
  }

  getImportJobs(authorId: string): ImportJob[] {
    return getImportJobs(authorId);
  }

  getExportJobs(authorId: string): ExportJob[] {
    return getExportJobs(authorId);
  }

  async prepareExport(input: PrepareExportInput): Promise<ExportJob> {
    const format: ExportFormat = input.format ?? 'csv';
    const columns = EXPORT_COLUMNS[input.type];
    let rowCount = 0;

    switch (input.type) {
      case 'royalties':
        rowCount = this.revenue.getRoyalties(input.authorId).length;
        break;
      case 'sales':
        rowCount = this.revenue.getSalesReport(input.authorId).length;
        break;
      case 'payouts':
        rowCount = this.earnings.getPayoutHistory(input.authorId).length;
        break;
      case 'performance':
        rowCount = (await this.performance.getDashboard(input.authorId)).length;
        break;
      case 'analytics': {
        const summary = await this.analytics.getSummary(input.authorId);
        rowCount = summary.byBook.length;
        break;
      }
    }

    const { filename } = prepareExportFile({
      authorId: input.authorId,
      type: input.type,
      format,
      columns,
      rowCount,
    });

    return createExportJob({
      authorId: input.authorId,
      type: input.type,
      format,
      filename,
      columns,
      rowCount,
    });
  }
}

export function createImportExportService(
  revenue: AuthorRevenueService,
  earnings: EarningsPayoutsService,
  performance: BookPerformanceService,
  analytics: AuthorAnalyticsService
): ImportExportService {
  return new ImportExportService(revenue, earnings, performance, analytics);
}
