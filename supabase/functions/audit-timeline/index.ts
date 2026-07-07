import { InternalError } from '../_shared/errors/app-error.ts';
import { createEnterpriseHandler } from '../_shared/handler-enterprise.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import {
  buildCursorPage,
  maskSensitiveData,
  parseOperatingSystem,
  resolveProfileLabel,
  validateTimelineListRequest,
} from '../_shared/timeline/timeline-utils.ts';

function classifySeverity(action: string, metadata: Record<string, unknown>): 'normal' | 'warning' | 'critical' {
  const normalized = action.toLowerCase();
  if (['delete', 'bulk_operation', 'bulk_delete', 'role_escalation', 'protected_action'].includes(normalized)) {
    return 'critical';
  }
  if (metadata.protectedAccount === true || metadata.bulkOperation) return 'critical';
  if (['suspend', 'password_reset', 'reset_mfa', 'disable_mfa', 'revoke_all'].includes(normalized)) return 'warning';
  return 'normal';
}

Deno.serve(
  createEnterpriseHandler('audit-timeline', { permission: 'super_admin' }, async (ctx) => {
    const startedAt = Date.now();
    const payload = validateTimelineListRequest(ctx.body);
    const limit = payload.limit ?? 25;

    let query = ctx.adminClient
      .from('audit_logs')
      .select('*')
      .or(`target_id.eq.${payload.userId},actor_id.eq.${payload.userId}`)
      .order('created_at', { ascending: false })
      .limit(limit + 1);

    if (payload.cursor) query = query.lt('created_at', payload.cursor);
    if (payload.actionFilter) query = query.eq('action', payload.actionFilter);
    if (payload.dateFrom) query = query.gte('created_at', `${payload.dateFrom}T00:00:00.000Z`);
    if (payload.dateTo) query = query.lte('created_at', `${payload.dateTo}T23:59:59.999Z`);
    if (payload.search) {
      query = query.or(
        `action.ilike.%${payload.search}%,entity.ilike.%${payload.search}%,target_type.ilike.%${payload.search}%`,
      );
    }

    const { data, error } = await query;
    if (error) throw new InternalError(error.message);

    const actorIds = new Set<string>();
    for (const row of data ?? []) {
      if (row.actor_id) actorIds.add(row.actor_id as string);
      if (row.target_id) actorIds.add(row.target_id as string);
    }
    const labelCache = new Map<string, string | null>();
    await Promise.all(
      Array.from(actorIds).map(async (id) => {
        labelCache.set(id, await resolveProfileLabel(ctx.adminClient, id));
      }),
    );

    const mapped = (data ?? []).map((row) => {
      const metadata = maskSensitiveData((row.metadata as Record<string, unknown>) ?? {});
      const severity = classifySeverity(String(row.action), metadata);
      return {
        id: String(row.id),
        actorId: row.actor_id ? String(row.actor_id) : null,
        actorLabel: row.actor_id ? labelCache.get(String(row.actor_id)) ?? null : null,
        targetId: row.target_id ? String(row.target_id) : null,
        targetType: row.target_type ? String(row.target_type) : null,
        targetLabel: row.target_id ? labelCache.get(String(row.target_id)) ?? null : null,
        action: String(row.action),
        entity: String(row.entity),
        beforeState: maskSensitiveData((row.before_state as Record<string, unknown>) ?? null),
        afterState: maskSensitiveData((row.after_state as Record<string, unknown>) ?? null),
        createdAt: String(row.created_at),
        browser: row.browser ? String(row.browser) : null,
        operatingSystem: parseOperatingSystem(row.user_agent as string | null, row.platform as string | null),
        platform: row.platform ? String(row.platform) : null,
        ipAddress: row.ip_address ? String(row.ip_address) : null,
        requestId: String(row.request_id),
        traceId: String(row.trace_id),
        correlationId: String(row.correlation_id),
        severity,
        metadata,
      };
    }).filter((item) => !payload.severity || item.severity === payload.severity);

    const page = buildCursorPage(mapped, limit);

    if (payload.action === 'export') {
      return jsonSuccess({
        exportFormat: payload.exportFormat ?? 'json',
        rows: page.items,
        rowCount: page.items.length,
      });
    }

    return jsonSuccess({
      ...page,
      metrics: {
        queryTimeMs: Date.now() - startedAt,
        edgeTimeMs: Date.now() - startedAt,
        recordsReturned: page.items.length,
        cacheHit: false,
      },
    });
  }),
);
