import type { TimelineExportFormat, TimelineFilters } from '../../../enterprise/timeline';
import { downloadExportFile } from '../import-export/utils/file-utils';
import { getPeopleTimelineService } from './timeline.service';

type TimelineExportKind = 'audit' | 'login-history' | 'security-events' | 'activity';

function flattenRows(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  return rows.map((row) => {
    const flat: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        flat[key] = JSON.stringify(value);
      } else {
        flat[key] = value ?? '';
      }
    }
    return flat;
  });
}

function downloadJson(filename: string, rows: Record<string, unknown>[]): void {
  const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportPeopleTimeline(
  kind: TimelineExportKind,
  userId: string,
  format: TimelineExportFormat,
  filters: TimelineFilters,
): Promise<void> {
  const service = getPeopleTimelineService();
  const prefix = `people-${kind}-${userId.slice(0, 8)}`;

  if (kind === 'activity') {
    const page = await service.fetchActivityPage({ userId, limit: 500, ...filters });
    const rows = flattenRows(page.items as unknown as Record<string, unknown>[]);
    if (format === 'json') {
      downloadJson(`${prefix}.json`, rows);
      return;
    }
    const columns = ['id', 'title', 'description', 'activityType', 'createdAt'];
    downloadExportFile(format, columns, rows, prefix);
    return;
  }

  const exportFn =
    kind === 'audit'
      ? service.exportAudit.bind(service)
      : kind === 'login-history'
        ? service.exportLoginHistory.bind(service)
        : service.exportSecurityEvents.bind(service);

  const result = await exportFn(userId, format, filters);
  const rows = flattenRows(result.rows as unknown as Record<string, unknown>[]);

  if (format === 'json') {
    downloadJson(`${prefix}.json`, rows);
    return;
  }

  const columns = rows.length > 0 ? Object.keys(rows[0]) : ['id'];
  downloadExportFile(format, columns, rows, prefix);
}
