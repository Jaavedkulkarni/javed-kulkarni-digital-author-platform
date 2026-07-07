import type { SupabaseClient, User } from 'npm:@supabase/supabase-js@2';
import { createAdminClient, resolveActor } from '../auth/context.ts';
import { writeAuditLog } from '../audit/writer.ts';
import { toAppError, type AppError } from '../errors/app-error.ts';
import { getDomainEventBus } from '../events/domain-event-bus.ts';
import { checkIdempotency, storeIdempotencyResult } from '../idempotency/middleware.ts';
import { createLogger, type Logger } from '../logging/logger.ts';
import { recordRequestMetric } from '../observability/metrics.ts';
import { enforceRateLimit, rateLimitHeaders, DEFAULT_RATE_LIMIT_CONFIG } from '../rate-limit/middleware.ts';
import {
  attachActorToContext,
  buildRequestContext,
  contextResponseHeaders,
  type RequestContext,
} from '../request-context/context.ts';
import { jsonFromError, jsonResponse, methodNotAllowed } from '../responses/json.ts';
import { applySecurityHeaders } from '../security/headers.ts';
import { corsPreflightResponse, withCors } from '../cors.ts';
import { requirePermission } from '../permissions/middleware.ts';
import { dispatchWebhookEvent } from '../webhooks/dispatcher.ts';

export interface EnterpriseHandlerContext {
  req: Request;
  logger: Logger;
  requestContext: RequestContext;
  adminClient: SupabaseClient;
  userClient: SupabaseClient;
  actor: User;
  actorRoles: string[];
  body: unknown;
}

export type EnterpriseHandler = (ctx: EnterpriseHandlerContext) => Promise<Response>;

export interface EnterpriseHandlerOptions {
  permission?: 'super_admin' | 'admin' | 'staff';
  skipAuth?: boolean;
  skipRateLimit?: boolean;
  skipIdempotency?: boolean;
}

function mergeHeaders(...groups: HeadersInit[]): Headers {
  const headers = new Headers();
  for (const group of groups) {
    const entries = group instanceof Headers ? group.entries() : Object.entries(group);
    for (const [key, value] of entries) {
      headers.set(key, value);
    }
  }
  return headers;
}

export function createEnterpriseHandler(
  scope: string,
  options: EnterpriseHandlerOptions,
  handler: EnterpriseHandler,
): (req: Request) => Promise<Response> {
  const logger = createLogger(scope);

  return async (req: Request): Promise<Response> => {
    if (req.method === 'OPTIONS') {
      return corsPreflightResponse();
    }

    if (req.method !== 'POST') {
      return methodNotAllowed(withCors(applySecurityHeaders()));
    }

    const startedAt = Date.now();
    let requestContext = buildRequestContext(req, scope);
    const adminClient = createAdminClient();

    try {
      const body = await readJsonBody(req);

      if (!options.skipRateLimit) {
        await enforceRateLimit(adminClient, requestContext, scope, DEFAULT_RATE_LIMIT_CONFIG, logger);
      }

      let userClient: SupabaseClient;
      let actor: User;
      let actorRoles: string[] = [];

      if (options.skipAuth) {
        userClient = adminClient;
        actor = { id: 'system' } as User;
      } else {
        const resolved = await resolveActor(req);
        userClient = resolved.userClient;
        actor = resolved.user;

        if (options.permission) {
          const permissionResult = await requirePermission(userClient, actor, options.permission);
          actorRoles = permissionResult.roles;
          requestContext = attachActorToContext(
            requestContext,
            actor.id,
            permissionResult.primaryRole,
            actorRoles,
          );
        } else {
          requestContext = attachActorToContext(requestContext, actor.id, null, actorRoles);
        }
      }

      if (!options.skipIdempotency) {
        const idempotency = await checkIdempotency(
          adminClient,
          scope,
          req,
          body,
          requestContext.actorId,
          logger,
        );
        if (idempotency?.replay) {
          return jsonResponse(idempotency.responseBody, idempotency.responseStatus, mergeHeaders(
            withCors(),
            applySecurityHeaders(),
            contextResponseHeaders(requestContext),
          ));
        }
      }

      const response = await handler({
        req,
        logger,
        requestContext,
        adminClient,
        userClient,
        actor,
        actorRoles,
        body,
      });

      const durationMs = Date.now() - startedAt;
      recordRequestMetric(scope, 'success', durationMs, logger);

      if (!options.skipIdempotency) {
        let responseBody: unknown = null;
        try {
          responseBody = await response.clone().json();
        } catch {
          responseBody = { success: true };
        }
        await storeIdempotencyResult(
          adminClient,
          scope,
          req,
          body,
          requestContext.actorId,
          response.status,
          responseBody,
          logger,
        );
      }

      const headers = mergeHeaders(
        response.headers,
        withCors(),
        applySecurityHeaders(),
        contextResponseHeaders(requestContext),
      );

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    } catch (error) {
      const durationMs = Date.now() - startedAt;
      recordRequestMetric(scope, 'failure', durationMs, logger);
      const appError = toAppError(error) as AppError;
      const extraHeaders =
        appError.status === 429 && appError.details?.retryAfter
          ? rateLimitHeaders(Number(appError.details.retryAfter))
          : {};
      logger.error('Enterprise handler error', {
        code: appError.code,
        message: appError.message,
        requestId: requestContext.requestId,
      });
      return jsonFromError(appError, mergeHeaders(
        withCors(),
        applySecurityHeaders(),
        contextResponseHeaders(requestContext),
        extraHeaders,
      ));
    }
  };
}

export async function readJsonBody(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

export async function emitDomainEventAndAudit(
  ctx: EnterpriseHandlerContext,
  input: {
    eventType: Parameters<ReturnType<typeof getDomainEventBus>['publish']>[0];
    payload: Record<string, unknown>;
    audit: Parameters<typeof writeAuditLog>[2];
    activity?: Parameters<typeof import('../audit/writer.ts').writeActivityLog>[2];
  },
): Promise<void> {
  const bus = getDomainEventBus();
  bus.publish(input.eventType, input.payload, {
    requestId: ctx.requestContext.requestId,
    correlationId: ctx.requestContext.correlationId,
    traceId: ctx.requestContext.traceId,
  });

  await writeAuditLog(ctx.adminClient, ctx.requestContext, input.audit, ctx.logger);

  if (input.activity) {
    const { writeActivityLog } = await import('../audit/writer.ts');
    await writeActivityLog(ctx.adminClient, ctx.requestContext, input.activity, ctx.logger);
  }

  await dispatchWebhookEvent(ctx.adminClient, input.eventType, input.payload, ctx.logger);
}
