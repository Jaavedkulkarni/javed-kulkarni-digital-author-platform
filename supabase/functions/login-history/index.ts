import { InternalError } from '../_shared/errors/app-error.ts';
import { createEnterpriseHandler } from '../_shared/handler-enterprise.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import {
  buildCursorPage,
  maskSensitiveData,
  parseDevice,
  parseOperatingSystem,
  validateTimelineListRequest,
} from '../_shared/timeline/timeline-utils.ts';

const LOGIN_ACTIONS = new Set([
  'login',
  'logout',
  'failed_login',
  'password_change',
  'password_reset',
  'session_created',
  'session_revoked',
  'mfa_enabled',
  'mfa_disabled',
]);

const ACTIVITY_LOGIN_TYPES = new Set([
  'password_change',
  'password_reset',
  'update',
]);

function mapLoginEventType(action: string, activityType?: string, metadata?: Record<string, unknown>): string {
  const metaType = typeof metadata?.eventType === 'string' ? metadata.eventType : '';
  if (metaType && LOGIN_ACTIONS.has(metaType)) return metaType;
  if (action === 'password_reset' || activityType === 'password_reset') return 'password_change';
  if (action.includes('session') || metaType.includes('session')) {
    return action.includes('revoke') || metaType.includes('revoke') ? 'session_revoked' : 'session_created';
  }
  if (action.includes('mfa')) return action.includes('disable') ? 'mfa_disabled' : 'mfa_enabled';
  if (metadata?.failedAttempts) return 'failed_login';
  if (action === 'login' || metaType === 'login') return 'login';
  if (action === 'logout' || metaType === 'logout') return 'logout';
  return metaType || action || 'login';
}

function classifyLoginSeverity(eventType: string, metadata: Record<string, unknown>): 'normal' | 'warning' | 'critical' {
  if (eventType === 'failed_login') {
    const attempts = typeof metadata.failedAttempts === 'number' ? metadata.failedAttempts : 0;
    return attempts >= 5 ? 'critical' : 'warning';
  }
  if (metadata.impossibleTravel === true || metadata.newCountry === true) return 'critical';
  if (metadata.newDevice === true || metadata.newBrowser === true) return 'warning';
  return 'normal';
}

Deno.serve(
  createEnterpriseHandler('login-history', { permission: 'super_admin' }, async (ctx) => {
    const startedAt = Date.now();
    const payload = validateTimelineListRequest(ctx.body);
    const limit = payload.limit ?? 25;

    const [auditRes, activityRes, authUserRes, securityRes] = await Promise.all([
      ctx.adminClient
        .from('audit_logs')
        .select('*')
        .or(`target_id.eq.${payload.userId},actor_id.eq.${payload.userId}`)
        .in('action', ['password_reset', 'login', 'logout', 'update'])
        .order('created_at', { ascending: false })
        .limit(200),
      ctx.adminClient
        .from('activity_logs')
        .select('*')
        .or(`target_id.eq.${payload.userId},actor_id.eq.${payload.userId}`)
        .in('activity_type', Array.from(ACTIVITY_LOGIN_TYPES))
        .order('created_at', { ascending: false })
        .limit(200),
      ctx.adminClient.auth.admin.getUserById(payload.userId),
      ctx.adminClient.from('user_security').select('metadata').eq('user_id', payload.userId).maybeSingle(),
    ]);

    if (auditRes.error) throw new InternalError(auditRes.error.message);
    if (activityRes.error) throw new InternalError(activityRes.error.message);

    const events: Array<Record<string, unknown>> = [];

    for (const row of auditRes.data ?? []) {
      const metadata = maskSensitiveData((row.metadata as Record<string, unknown>) ?? {});
      const eventType = mapLoginEventType(String(row.action), undefined, metadata);
      if (payload.eventType && eventType !== payload.eventType) continue;
      events.push({
        id: `audit-${row.id}`,
        eventType,
        title: eventType.replace(/_/g, ' '),
        description: row.action ? String(row.action) : null,
        browser: row.browser,
        operatingSystem: parseOperatingSystem(row.user_agent as string | null, row.platform as string | null),
        device: parseDevice(row.user_agent as string | null),
        country: metadata.country ?? null,
        region: metadata.region ?? null,
        ipAddress: row.ip_address,
        createdAt: row.created_at,
        isCurrentSession: false,
        severity: classifyLoginSeverity(eventType, metadata),
        metadata,
      });
    }

    for (const row of activityRes.data ?? []) {
      const metadata = maskSensitiveData((row.metadata as Record<string, unknown>) ?? {});
      const eventType = mapLoginEventType('', String(row.activity_type), metadata);
      if (payload.eventType && eventType !== payload.eventType) continue;
      events.push({
        id: `activity-${row.id}`,
        eventType,
        title: row.description ? String(row.description) : eventType.replace(/_/g, ' '),
        description: row.description ? String(row.description) : null,
        browser: metadata.browser ?? null,
        operatingSystem: metadata.operatingSystem ?? null,
        device: metadata.device ?? null,
        country: metadata.country ?? null,
        region: metadata.region ?? null,
        ipAddress: metadata.ipAddress ?? null,
        createdAt: row.created_at,
        isCurrentSession: false,
        severity: classifyLoginSeverity(eventType, metadata),
        metadata,
      });
    }

    const lockMeta = (securityRes.data?.metadata as Record<string, unknown> | null)?.account_lock as
      | Record<string, unknown>
      | undefined;
    if (lockMeta?.lastFailedLogin) {
      const metadata = maskSensitiveData({
        failedAttempts: lockMeta.failedAttempts ?? 0,
        ...lockMeta,
      });
      events.push({
        id: `lock-${payload.userId}`,
        eventType: 'failed_login',
        title: 'Failed login',
        description: 'Recorded failed login attempt',
        browser: null,
        operatingSystem: null,
        device: null,
        country: null,
        region: null,
        ipAddress: null,
        createdAt: lockMeta.lastFailedLogin,
        isCurrentSession: false,
        severity: classifyLoginSeverity('failed_login', metadata as Record<string, unknown>),
        metadata,
      });
    }

    if (authUserRes.data.user?.last_sign_in_at) {
      events.push({
        id: `auth-signin-${payload.userId}`,
        eventType: 'login',
        title: 'Successful login',
        description: 'Last sign-in recorded by authentication provider',
        browser: null,
        operatingSystem: null,
        device: null,
        country: null,
        region: null,
        ipAddress: null,
        createdAt: authUserRes.data.user.last_sign_in_at,
        isCurrentSession: true,
        severity: 'normal',
        metadata: {},
      });
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
    if (payload.dateFrom) {
      filtered = filtered.filter((item) => String(item.createdAt) >= `${payload.dateFrom}T00:00:00.000Z`);
    }
    if (payload.dateTo) {
      filtered = filtered.filter((item) => String(item.createdAt) <= `${payload.dateTo}T23:59:59.999Z`);
    }
    if (payload.cursor) {
      filtered = filtered.filter((item) => String(item.createdAt) < payload.cursor);
    }

    const page = buildCursorPage(
      filtered.map((item) => ({
        ...item,
        createdAt: String(item.createdAt),
      })) as Array<{ createdAt: string } & Record<string, unknown>>,
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
