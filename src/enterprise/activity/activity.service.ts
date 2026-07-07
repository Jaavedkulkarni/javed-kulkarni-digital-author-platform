import { getBrowserClient } from '../../lib/supabase/clients/browser';
import { SYSTEM_LIMITS } from '../../core/constants/system.constants';
import type { ActivityLogQuery, ActivityLogRecord, UserActivityLogQuery } from './activity.types';
import type { ActivityTimelineEvent } from './activity-grouping';

export class ActivityLogService {
  async getTimeline(query: ActivityLogQuery): Promise<ActivityLogRecord[]> {
    const client = getBrowserClient();
    const { data, error } = await client
      .from('activity_logs')
      .select('*')
      .eq('target_type', query.targetType)
      .eq('target_id', query.targetId)
      .order('created_at', { ascending: false })
      .limit(query.limit ?? SYSTEM_LIMITS.maxActivityLogFetch);

    if (error) throw error;

    return (data ?? []).map(mapActivityRow);
  }

  async getUserTimeline(query: UserActivityLogQuery): Promise<ActivityLogRecord[]> {
    const client = getBrowserClient();
    const limit = query.limit ?? SYSTEM_LIMITS.maxActivityLogFetch;
    let builder = client
      .from('activity_logs')
      .select('*')
      .or(`target_id.eq.${query.userId},actor_id.eq.${query.userId}`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (query.cursor) builder = builder.lt('created_at', query.cursor);
    if (query.dateFrom) builder = builder.gte('created_at', `${query.dateFrom}T00:00:00.000Z`);
    if (query.dateTo) builder = builder.lte('created_at', `${query.dateTo}T23:59:59.999Z`);
    if (query.search?.trim()) {
      builder = builder.or(
        `description.ilike.%${query.search.trim()}%,activity_type.ilike.%${query.search.trim()}%`,
      );
    }

    const { data, error } = await builder;
    if (error) throw error;

    return (data ?? []).map(mapActivityRow);
  }
}

export function mapActivityRecordToTimelineEvent(record: ActivityLogRecord): ActivityTimelineEvent {
  return {
    id: record.id,
    createdAt: record.createdAt,
    title: record.description ?? humanizeActivityType(record.activityType),
    description: extractActivityDetail(record.metadata),
    activityType: record.activityType,
    metadata: {
      ...record.metadata,
      actorId: record.actorId,
      targetId: record.targetId,
      requestId: record.requestId,
      traceId: record.traceId,
      correlationId: record.correlationId,
    },
  };
}

function humanizeActivityType(value: string): string {
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function extractActivityDetail(metadata: Record<string, unknown>): string | null {
  const reason = metadata.reason;
  if (typeof reason === 'string' && reason.trim()) return reason;
  const operation = metadata.bulkOperation;
  if (typeof operation === 'string') return `Bulk ${operation.replace(/_/g, ' ')}`;
  return null;
}

function mapActivityRow(row: Record<string, unknown>): ActivityLogRecord {
  return {
    id: String(row.id),
    requestId: row.request_id ? String(row.request_id) : null,
    correlationId: row.correlation_id ? String(row.correlation_id) : null,
    traceId: row.trace_id ? String(row.trace_id) : null,
    actorId: row.actor_id ? String(row.actor_id) : null,
    targetId: String(row.target_id),
    targetType: String(row.target_type),
    activityType: String(row.activity_type),
    description: row.description ? String(row.description) : null,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    createdAt: String(row.created_at),
  };
}

let service: ActivityLogService | null = null;

export function getActivityLogService(): ActivityLogService {
  if (!service) service = new ActivityLogService();
  return service;
}
