import { InternalError } from '../_shared/errors/app-error.ts';
import { createEnterpriseHandler } from '../_shared/handler-enterprise.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import {
  buildCursorPage,
  maskSensitiveData,
  resolveProfileLabel,
  validateTimelineListRequest,
} from '../_shared/timeline/timeline-utils.ts';

const SECURITY_EVENT_TYPES = [
  'password_reset',
  'password_expired',
  'temporary_password_generated',
  'temporary_password_used',
  'email_verified',
  'verification_revoked',
  'invite_sent',
  'invite_accepted',
  'invite_cancelled',
  'account_locked',
  'account_unlocked',
  'failed_login_threshold',
  'protected_account_action',
  'role_escalation',
  'bulk_security_action',
];

function resolveSecurityEventType(
  action: string,
  activityType: string,
  metadata: Record<string, unknown>,
): string | null {
  const explicit = typeof metadata.eventType === 'string' ? metadata.eventType : '';
  if (explicit) return explicit;
  if (typeof metadata.securityEvent === 'string') return metadata.securityEvent;
  if (action === 'password_reset' || activityType === 'password_reset') return 'password_reset';
  if (action.includes('verification')) {
    return action.includes('revoke') ? 'verification_revoked' : 'email_verified';
  }
  if (action.includes('invite')) {
    if (action.includes('cancel')) return 'invite_cancelled';
    if (action.includes('accept')) return 'invite_accepted';
    return 'invite_sent';
  }
  if (action === 'unlock' || metadata.unlocked === true) return 'account_unlocked';
  if (metadata.accountLock === true || action.includes('lock')) return 'account_locked';
  if (metadata.bulkOperation || action === 'bulk_operation') return 'bulk_security_action';
  if (metadata.protectedAccount === true) return 'protected_account_action';
  if (metadata.roleEscalation === true || action.includes('assign')) return 'role_escalation';
  if (metadata.temporaryPassword === true) return 'temporary_password_generated';
  if (activityType === 'invite') return 'invite_sent';
  return null;
}

function classifySecuritySeverity(eventType: string, metadata: Record<string, unknown>): 'normal' | 'warning' | 'critical' {
  if (['protected_account_action', 'role_escalation', 'bulk_security_action', 'failed_login_threshold'].includes(eventType)) {
    return 'critical';
  }
  if (['account_locked', 'verification_revoked', 'password_reset', 'temporary_password_generated'].includes(eventType)) {
    return 'warning';
  }
  return 'normal';
}

Deno.serve(
  createEnterpriseHandler('security-events', { permission: 'super_admin' }, async (ctx) => {
    const startedAt = Date.now();
    const payload = validateTimelineListRequest(ctx.body);
    const limit = payload.limit ?? 25;

    const [auditRes, activityRes] = await Promise.all([
      ctx.adminClient
        .from('audit_logs')
        .select('*')
        .or(`target_id.eq.${payload.userId},actor_id.eq.${payload.userId}`)
        .order('created_at', { ascending: false })
        .limit(250),
      ctx.adminClient
        .from('activity_logs')
        .select('*')
        .or(`target_id.eq.${payload.userId},actor_id.eq.${payload.userId}`)
        .order('created_at', { ascending: false })
        .limit(250),
    ]);

    if (auditRes.error) throw new InternalError(auditRes.error.message);
    if (activityRes.error) throw new InternalError(activityRes.error.message);

    const events: Array<Record<string, unknown>> = [];

    for (const row of auditRes.data ?? []) {
      const metadata = maskSensitiveData((row.metadata as Record<string, unknown>) ?? {});
      const eventType = resolveSecurityEventType(String(row.action), '', metadata);
      if (!eventType) continue;
      if (payload.eventType && eventType !== payload.eventType) continue;
      events.push({
        id: `audit-${row.id}`,
        eventType,
        title: eventType.replace(/_/g, ' '),
        description: row.action ? String(row.action) : null,
        actorId: row.actor_id,
        actorLabel: null,
        targetId: row.target_id,
        createdAt: row.created_at,
        severity: classifySecuritySeverity(eventType, metadata),
        requestId: row.request_id,
        traceId: row.trace_id,
        correlationId: row.correlation_id,
        metadata,
      });
    }

    for (const row of activityRes.data ?? []) {
      const metadata = maskSensitiveData((row.metadata as Record<string, unknown>) ?? {});
      const eventType = resolveSecurityEventType('', String(row.activity_type), metadata);
      if (!eventType) continue;
      if (payload.eventType && eventType !== payload.eventType) continue;
      events.push({
        id: `activity-${row.id}`,
        eventType,
        title: row.description ? String(row.description) : eventType.replace(/_/g, ' '),
        description: row.description ? String(row.description) : null,
        actorId: row.actor_id,
        actorLabel: null,
        targetId: row.target_id,
        createdAt: row.created_at,
        severity: classifySecuritySeverity(eventType, metadata),
        requestId: row.request_id,
        traceId: row.trace_id,
        correlationId: row.correlation_id,
        metadata,
      });
    }

    const actorIds = new Set<string>();
    for (const event of events) {
      if (event.actorId) actorIds.add(String(event.actorId));
    }
    const labelCache = new Map<string, string | null>();
    await Promise.all(
      Array.from(actorIds).map(async (id) => {
        labelCache.set(id, await resolveProfileLabel(ctx.adminClient, id));
      }),
    );
    for (const event of events) {
      if (event.actorId) event.actorLabel = labelCache.get(String(event.actorId)) ?? null;
    }

    let filtered = events.sort(
      (a, b) => new Date(String(b.createdAt)).getTime() - new Date(String(a.createdAt)).getTime(),
    );

    if (payload.search) {
      const term = payload.search.toLowerCase();
      filtered = filtered.filter((item) =>
        String(item.title).toLowerCase().includes(term) ||
        String(item.eventType).toLowerCase().includes(term)
      );
    }
    if (payload.severity) {
      filtered = filtered.filter((item) => item.severity === payload.severity);
    }
    if (payload.cursor) {
      filtered = filtered.filter((item) => String(item.createdAt) < payload.cursor);
    }

    const page = buildCursorPage(
      filtered.map((item) => ({ ...item, createdAt: String(item.createdAt) })) as Array<
        { createdAt: string } & Record<string, unknown>
      >,
      limit,
    );

    if (payload.action === 'export') {
      return jsonSuccess({
        exportFormat: payload.exportFormat ?? 'json',
        rows: page.items,
        rowCount: page.items.length,
      });
    }

    return jsonSuccess({
      items: page.items,
      nextCursor: page.nextCursor,
      metrics: {
        queryTimeMs: Date.now() - startedAt,
        edgeTimeMs: Date.now() - startedAt,
        recordsReturned: page.items.length,
        cacheHit: false,
      },
    });
  }),
);

export { SECURITY_EVENT_TYPES };
