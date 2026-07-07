import { invokeEdgeFunctionOrThrow } from '../../../lib/edge-functions';
import { createIdempotencyKey } from '../../../enterprise/idempotency/idempotency-key';
import type {
  AuditTimelineItem,
  LoginHistoryItem,
  SecurityEventItem,
  TimelineExportFormat,
  TimelineFilters,
  TimelinePage,
} from '../../../enterprise/timeline';
import type { ActivityTimelineEvent } from '../../../enterprise/activity/activity-grouping';
import { getActivityLogService, mapActivityRecordToTimelineEvent } from '../../../enterprise/activity';

interface TimelineRequest extends TimelineFilters {
  userId: string;
  cursor?: string | null;
  limit?: number;
}

function invokeTimeline<T>(functionName: string, body: Record<string, unknown>): Promise<T> {
  return invokeEdgeFunctionOrThrow<T>(functionName, body, {
    idempotencyKey: createIdempotencyKey(functionName),
  });
}

export class PeopleTimelineService {
  fetchAuditPage(request: TimelineRequest) {
    return invokeTimeline<TimelinePage<AuditTimelineItem>>('audit-timeline', {
      action: 'list',
      userId: request.userId,
      cursor: request.cursor,
      limit: request.limit,
      search: request.search,
      severity: request.severity,
      actionFilter: request.action,
      dateFrom: request.dateFrom,
      dateTo: request.dateTo,
    });
  }

  fetchLoginHistoryPage(request: TimelineRequest) {
    return invokeTimeline<TimelinePage<LoginHistoryItem>>('login-history', {
      action: 'list',
      ...request,
    });
  }

  fetchSecurityEventsPage(request: TimelineRequest) {
    return invokeTimeline<TimelinePage<SecurityEventItem>>('security-events', {
      action: 'list',
      ...request,
    });
  }

  async fetchActivityPage(request: TimelineRequest): Promise<TimelinePage<ActivityTimelineEvent>> {
    const startedAt = performance.now();
    const limit = request.limit ?? 25;
    const records = await getActivityLogService().getUserTimeline({
      userId: request.userId,
      limit: limit + 1,
      cursor: request.cursor,
      search: request.search,
      dateFrom: request.dateFrom,
      dateTo: request.dateTo,
    });

    let mapped = records.slice(0, limit).map(mapActivityRecordToTimelineEvent);
    if (request.severity) {
      mapped = mapped.filter((item) => classifyActivitySeverity(item) === request.severity);
    }

    const nextCursor = records.length > limit ? records[limit - 1]?.createdAt ?? null : null;

    return {
      items: mapped,
      nextCursor,
      metrics: {
        queryTimeMs: Math.round(performance.now() - startedAt),
        recordsReturned: mapped.length,
        cacheHit: false,
      },
    };
  }

  exportAudit(userId: string, format: TimelineExportFormat, filters: TimelineFilters) {
    return invokeTimeline<{ rows: AuditTimelineItem[] }>('audit-timeline', {
      action: 'export',
      userId,
      exportFormat: format,
      search: filters.search,
      severity: filters.severity,
      actionFilter: filters.action,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      limit: 500,
    });
  }

  exportLoginHistory(userId: string, format: TimelineExportFormat, filters: TimelineFilters) {
    return invokeTimeline<{ rows: LoginHistoryItem[] }>('login-history', {
      action: 'export',
      userId,
      exportFormat: format,
      ...filters,
      limit: 500,
    });
  }

  exportSecurityEvents(userId: string, format: TimelineExportFormat, filters: TimelineFilters) {
    return invokeTimeline<{ rows: SecurityEventItem[] }>('security-events', {
      action: 'export',
      userId,
      exportFormat: format,
      ...filters,
      limit: 500,
    });
  }
}

function classifyActivitySeverity(item: ActivityTimelineEvent): 'normal' | 'warning' | 'critical' {
  const type = (item.activityType ?? '').toLowerCase();
  if (type.includes('delete') || type.includes('bulk')) return 'critical';
  if (type.includes('suspend') || type.includes('password') || type.includes('reset')) return 'warning';
  return 'normal';
}

let service: PeopleTimelineService | null = null;

export function getPeopleTimelineService(): PeopleTimelineService {
  if (!service) service = new PeopleTimelineService();
  return service;
}
