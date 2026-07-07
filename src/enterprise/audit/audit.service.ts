import { getBrowserClient } from '../../lib/supabase/clients/browser';
import type { AuditLogQuery, AuditLogRecord } from './audit.types';

export class AuditLogService {
  async list(query: AuditLogQuery = {}): Promise<AuditLogRecord[]> {
    const client = getBrowserClient();
    let builder = client
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(query.limit ?? 50);

    if (query.targetType) builder = builder.eq('target_type', query.targetType);
    if (query.targetId) builder = builder.eq('target_id', query.targetId);
    if (query.actorId) builder = builder.eq('actor_id', query.actorId);

    const { data, error } = await builder;
    if (error) throw error;

    return (data ?? []).map(mapAuditRow);
  }
}

function mapAuditRow(row: Record<string, unknown>): AuditLogRecord {
  return {
    id: String(row.id),
    requestId: String(row.request_id),
    correlationId: String(row.correlation_id),
    traceId: String(row.trace_id),
    spanId: row.span_id ? String(row.span_id) : null,
    actorId: row.actor_id ? String(row.actor_id) : null,
    actorRole: row.actor_role ? String(row.actor_role) : null,
    targetId: row.target_id ? String(row.target_id) : null,
    targetType: row.target_type ? String(row.target_type) : null,
    action: String(row.action),
    entity: String(row.entity),
    beforeState: (row.before_state as Record<string, unknown>) ?? null,
    afterState: (row.after_state as Record<string, unknown>) ?? null,
    ipAddress: row.ip_address ? String(row.ip_address) : null,
    browser: row.browser ? String(row.browser) : null,
    platform: row.platform ? String(row.platform) : null,
    userAgent: row.user_agent ? String(row.user_agent) : null,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    createdAt: String(row.created_at),
  };
}

let service: AuditLogService | null = null;

export function getAuditLogService(): AuditLogService {
  if (!service) service = new AuditLogService();
  return service;
}
