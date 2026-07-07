import { ConflictError, InternalError } from '../_shared/errors/app-error.ts';
import { createEnterpriseHandler, emitDomainEventAndAudit } from '../_shared/handler-enterprise.ts';
import { assertCanManageAccountSecurity } from '../_shared/security/account-security.ts';
import { queueSecurityNotification } from '../_shared/security/security-state.ts';
import { assertProfileExists } from '../_shared/permissions/checks.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import { validateManageSessionsRequest } from '../_shared/validation/security-requests.ts';

interface AuthSessionRow {
  id?: string;
  user_agent?: string | null;
  ip?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  refreshed_at?: string | null;
}

function parseUserAgent(userAgent: string | null | undefined) {
  const ua = userAgent ?? '';
  const browser = /Chrome/i.test(ua)
    ? 'Chrome'
    : /Firefox/i.test(ua)
      ? 'Firefox'
      : /Safari/i.test(ua)
        ? 'Safari'
        : /Edge/i.test(ua)
          ? 'Edge'
          : 'Unknown';
  const os = /Windows/i.test(ua)
    ? 'Windows'
    : /Mac OS/i.test(ua)
      ? 'macOS'
      : /Android/i.test(ua)
        ? 'Android'
        : /iPhone|iPad/i.test(ua)
          ? 'iOS'
          : /Linux/i.test(ua)
            ? 'Linux'
            : 'Unknown';
  const device = /Mobile/i.test(ua) ? 'Mobile' : /Tablet/i.test(ua) ? 'Tablet' : 'Desktop';
  return { browser, os, device };
}

async function listUserSessions(adminClient: ReturnType<typeof import('../_shared/auth/context.ts').createAdminClient>, userId: string) {
  const adminAuth = adminClient.auth.admin as {
    listUserSessions?: (userId: string) => Promise<{ data: { sessions: AuthSessionRow[] } | null; error: Error | null }>;
  };

  if (!adminAuth.listUserSessions) {
    return [];
  }

  const { data, error } = await adminAuth.listUserSessions(userId);
  if (error) return [];
  return data?.sessions ?? [];
}

Deno.serve(
  createEnterpriseHandler('manage-sessions', { permission: 'super_admin' }, async (ctx) => {
    const payload = validateManageSessionsRequest(ctx.body);
    await assertProfileExists(ctx.adminClient, payload.userId);

    if (payload.action === 'list') {
      const sessions = await listUserSessions(ctx.adminClient, payload.userId);
      const mapped = sessions.map((session, index) => {
        const parsed = parseUserAgent(session.user_agent);
        return {
          id: session.id ?? `session-${index}`,
          browser: parsed.browser,
          operatingSystem: parsed.os,
          device: parsed.device,
          ipAddress: session.ip ?? null,
          country: null,
          lastActivity: session.refreshed_at ?? session.updated_at ?? session.created_at ?? null,
          current: index === 0,
        };
      });
      return jsonSuccess({ sessions: mapped });
    }

    await assertCanManageAccountSecurity(ctx.adminClient, ctx.actor.id, payload.userId);

    if (payload.action === 'revoke_all') {
      const { error } = await ctx.adminClient.auth.admin.signOut(payload.userId, 'global');
      if (error) throw new InternalError(error.message);
      await queueSecurityNotification(ctx.adminClient, 'SessionsRevoked', {
        userId: payload.userId,
        actorId: ctx.actor.id,
        scope: 'all',
      }, ctx.logger);
    } else if (payload.action === 'revoke_session') {
      if (!payload.sessionId) throw new ConflictError('sessionId is required');
      const { error } = await ctx.adminClient.auth.admin.signOut(payload.sessionId);
      if (error) throw new InternalError(error.message);
      await queueSecurityNotification(ctx.adminClient, 'SessionsRevoked', {
        userId: payload.userId,
        actorId: ctx.actor.id,
        scope: 'single',
        sessionId: payload.sessionId,
      }, ctx.logger);
    }

    await emitDomainEventAndAudit(ctx, {
      eventType: 'UserUpdated',
      payload: { userId: payload.userId, action: payload.action },
      audit: {
        action: 'update',
        entity: 'session',
        targetId: payload.userId,
        targetType: 'user',
        metadata: { action: payload.action, sessionId: payload.sessionId },
      },
      activity: {
        targetId: payload.userId,
        targetType: 'user',
        activityType: 'update',
        description: 'Session revoked',
        metadata: { action: payload.action },
      },
    });

    return jsonSuccess({ revoked: true });
  }),
);
