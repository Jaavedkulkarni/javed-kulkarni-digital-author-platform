import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import type { RequestContext } from '../request-context/context.ts';
import type { Logger } from '../logging/logger.ts';

export interface AuditLogInput {
  action: string;
  entity: string;
  targetId?: string | null;
  targetType?: string | null;
  beforeState?: Record<string, unknown> | null;
  afterState?: Record<string, unknown> | null;
  metadata?: Record<string, unknown>;
}

export async function writeAuditLog(
  adminClient: SupabaseClient,
  context: RequestContext,
  input: AuditLogInput,
  logger: Logger,
): Promise<string | null> {
  const { data, error } = await adminClient.rpc('write_audit_log', {
    p_request_id: context.requestId,
    p_correlation_id: context.correlationId,
    p_trace_id: context.traceId,
    p_span_id: context.spanId,
    p_actor_id: context.actorId,
    p_actor_role: context.actorRole,
    p_target_id: input.targetId ?? null,
    p_target_type: input.targetType ?? null,
    p_action: input.action,
    p_entity: input.entity,
    p_before_state: input.beforeState ?? null,
    p_after_state: input.afterState ?? null,
    p_ip_address: context.ip,
    p_browser: context.browser,
    p_platform: context.platform,
    p_user_agent: context.userAgent,
    p_metadata: input.metadata ?? {},
  });

  if (error) {
    logger.error('Failed to write audit log', { message: error.message, action: input.action });
    return null;
  }

  return typeof data === 'string' ? data : null;
}

export type ActivityType =
  | 'create'
  | 'update'
  | 'delete'
  | 'suspend'
  | 'restore'
  | 'role_change'
  | 'avatar_change'
  | 'password_change'
  | 'password_reset'
  | 'invite'
  | 'verification';

export interface ActivityLogInput {
  targetId: string;
  targetType: string;
  activityType: ActivityType;
  description?: string;
  metadata?: Record<string, unknown>;
}

export async function writeActivityLog(
  adminClient: SupabaseClient,
  context: RequestContext,
  input: ActivityLogInput,
  logger: Logger,
): Promise<string | null> {
  const { data, error } = await adminClient.rpc('write_activity_log', {
    p_request_id: context.requestId,
    p_correlation_id: context.correlationId,
    p_trace_id: context.traceId,
    p_actor_id: context.actorId,
    p_target_id: input.targetId,
    p_target_type: input.targetType,
    p_activity_type: input.activityType,
    p_description: input.description ?? null,
    p_metadata: input.metadata ?? {},
  });

  if (error) {
    logger.error('Failed to write activity log', { message: error.message, type: input.activityType });
    return null;
  }

  return typeof data === 'string' ? data : null;
}
