import { getBrowserClient } from '../../lib/supabase/clients/browser';
import type { ActivityLogQuery, ActivityLogRecord } from './activity.types';

export class ActivityLogService {
  async getTimeline(query: ActivityLogQuery): Promise<ActivityLogRecord[]> {
    const client = getBrowserClient();
    const { data, error } = await client
      .from('activity_logs')
      .select('*')
      .eq('target_type', query.targetType)
      .eq('target_id', query.targetId)
      .order('created_at', { ascending: false })
      .limit(query.limit ?? 100);

    if (error) throw error;

    return (data ?? []).map(mapActivityRow);
  }
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
