import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import type { Logger } from '../logging/logger.ts';
import type { EnterpriseHandlerContext } from '../handler-enterprise.ts';
import { ConflictError, ForbiddenError, InternalError, NotFoundError } from '../errors/app-error.ts';
import { writeAuditLog, writeActivityLog } from '../audit/writer.ts';
import { enqueueJob } from '../jobs/queue.ts';
import {
  assertCanDeleteUser,
  assertCanRecoverUser,
  assertCanRestoreUser,
  assertCanSuspendUser,
  assertProfileDeletable,
  assertProfileRecoverable,
  assertProfileRestorable,
  assertProfileSuspendable,
} from '../permissions/user-lifecycle.ts';
import {
  assertCanManageAccountSecurity,
  assertCanResetPassword,
  getAuthUserEmail,
} from '../security/account-security.ts';
import { queueSecurityNotification } from '../security/security-state.ts';
import { setTemporaryPasswordMetadata } from '../temp-password/manager.ts';
import {
  readDeletionPreviousStatus,
  clearDeletionMetadata,
  clearSuspensionMetadata,
  writeDeletionMetadata,
  writeSuspensionMetadata,
} from '../user-lifecycle/metadata.ts';

export type BulkUserOperation =
  | 'suspend'
  | 'restore'
  | 'delete'
  | 'recover'
  | 'assign_role'
  | 'remove_role'
  | 'force_password_reset'
  | 'send_verification'
  | 'send_invite'
  | 'bulk_edit';

export type BulkUserResultStatus = 'success' | 'failed' | 'skipped';

export interface BulkUserResult {
  userId: string;
  email?: string | null;
  name?: string | null;
  status: BulkUserResultStatus;
  reason?: string;
}

export interface BulkOperationPayload {
  reason?: string;
  notes?: string;
  effectiveImmediately?: boolean;
  role?: string;
  confirmed?: boolean;
  fields?: Record<string, unknown>;
}

export interface BulkOperationProgress {
  completed: number;
  failed: number;
  skipped: number;
  total: number;
  currentUserId?: string | null;
  results: BulkUserResult[];
  cancelled?: boolean;
}

const SYNC_THRESHOLD = 25;

function mapErrorReason(error: unknown): string {
  if (error instanceof ForbiddenError || error instanceof ConflictError || error instanceof NotFoundError) {
    return error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return 'Operation failed';
}

async function loadProfile(
  adminClient: SupabaseClient,
  userId: string,
): Promise<{ id: string; status: string; deleted_at: string | null; email: string | null; full_name: string | null } | null> {
  const { data } = await adminClient
    .from('profiles')
    .select('id, status, deleted_at, email, full_name')
    .eq('id', userId)
    .maybeSingle();
  return data;
}

async function writeChildAudit(
  ctx: EnterpriseHandlerContext,
  parentAuditId: string,
  operation: BulkUserOperation,
  result: BulkUserResult,
): Promise<void> {
  await writeAuditLog(
    ctx.adminClient,
    ctx.requestContext,
    {
      action: `bulk_${operation}`,
      entity: 'user',
      targetId: result.userId,
      targetType: 'user',
      afterState: { status: result.status, reason: result.reason ?? null },
      metadata: { parentAuditId, bulkOperation: operation },
    },
    ctx.logger,
  );

  if (result.status === 'success') {
    await writeActivityLog(
      ctx.adminClient,
      ctx.requestContext,
      {
        targetId: result.userId,
        targetType: 'user',
        activityType: operation === 'delete' ? 'delete' : operation === 'suspend' ? 'suspend' : 'update',
        description: `Bulk ${operation.replace(/_/g, ' ')}`,
        metadata: { parentAuditId, bulkOperation: operation },
      },
      ctx.logger,
    );
  }
}

async function processSingleUser(
  ctx: EnterpriseHandlerContext,
  operation: BulkUserOperation,
  userId: string,
  payload: BulkOperationPayload,
): Promise<BulkUserResult> {
  const profile = await loadProfile(ctx.adminClient, userId);
  if (!profile) {
    return { userId, status: 'failed', reason: 'User not found' };
  }

  const base = {
    userId,
    email: profile.email,
    name: profile.full_name,
  };

  try {
    switch (operation) {
      case 'suspend': {
        await assertProfileSuspendable(profile);
        await assertCanSuspendUser(ctx.adminClient, ctx.actor.id, userId);
        const { error } = await ctx.adminClient
          .from('profiles')
          .update({ status: 'suspended', updated_at: new Date().toISOString() })
          .eq('id', userId);
        if (error) throw new InternalError(error.message);
        await writeSuspensionMetadata(ctx.adminClient, userId, ctx.actor.id, {
          reason: payload.reason ?? 'bulk_suspend',
          notes: payload.notes,
          effectiveImmediately: payload.effectiveImmediately ?? true,
        });
        return { ...base, status: 'success' };
      }
      case 'restore': {
        if (profile.deleted_at) {
          return { ...base, status: 'skipped', reason: 'User is deleted; use recover instead' };
        }
        if (profile.status !== 'suspended') {
          return { ...base, status: 'skipped', reason: 'User is not suspended' };
        }
        await assertCanRestoreUser(ctx.adminClient, ctx.actor.id, userId);
        const { error } = await ctx.adminClient
          .from('profiles')
          .update({ status: 'active', updated_at: new Date().toISOString() })
          .eq('id', userId);
        if (error) throw new InternalError(error.message);
        await clearSuspensionMetadata(ctx.adminClient, userId);
        return { ...base, status: 'success' };
      }
      case 'delete': {
        if (!payload.confirmed) throw new ConflictError('Delete confirmation required');
        await assertProfileDeletable(profile);
        await assertCanDeleteUser(ctx.adminClient, ctx.actor.id, userId);
        const deletedAt = new Date().toISOString();
        const { error } = await ctx.adminClient
          .from('profiles')
          .update({ deleted_at: deletedAt, status: 'deleted', updated_at: deletedAt })
          .eq('id', userId);
        if (error) throw new InternalError(error.message);
        await writeDeletionMetadata(ctx.adminClient, userId, ctx.actor.id, {
          reason: payload.reason ?? 'bulk_delete',
          notes: payload.notes,
          previousStatus: profile.status,
        }, deletedAt);
        return { ...base, status: 'success' };
      }
      case 'recover': {
        await assertProfileRecoverable(profile);
        await assertCanRecoverUser(ctx.adminClient, ctx.actor.id, userId);
        const restoredStatus = await readDeletionPreviousStatus(ctx.adminClient, userId);
        await clearDeletionMetadata(ctx.adminClient, userId);
        const { error } = await ctx.adminClient
          .from('profiles')
          .update({ deleted_at: null, status: restoredStatus, updated_at: new Date().toISOString() })
          .eq('id', userId);
        if (error) throw new InternalError(error.message);
        return { ...base, status: 'success' };
      }
      case 'assign_role':
      case 'remove_role': {
        if (!payload.role) throw new ConflictError('Role is required');
        await assertCanManageAccountSecurity(ctx.adminClient, ctx.actor.id, userId);
        const { error } = await ctx.userClient.rpc('apply_user_role_change', {
          p_target_user_id: userId,
          p_role_name: payload.role,
          p_action: operation === 'assign_role' ? 'assign' : 'remove',
          p_reason: payload.notes ?? `Bulk ${operation.replace(/_/g, ' ')}`,
        });
        if (error && !error.message.includes('Role already assigned') && !error.message.includes('Role not assigned')) {
          throw error;
        }
        if (error?.message.includes('Role already assigned') || error?.message.includes('Role not assigned')) {
          return { ...base, status: 'skipped', reason: error.message };
        }
        return { ...base, status: 'success' };
      }
      case 'force_password_reset': {
        await assertCanResetPassword(ctx.adminClient, ctx.actor.id, userId);
        await setTemporaryPasswordMetadata(ctx.adminClient, userId, ctx.actor.id, {
          forcePasswordChange: true,
          firstLoginRequired: true,
          ttlHours: 168,
        });
        return { ...base, status: 'success' };
      }
      case 'send_verification': {
        await assertCanManageAccountSecurity(ctx.adminClient, ctx.actor.id, userId);
        const authUser = await getAuthUserEmail(ctx.adminClient, userId);
        const { error } = await ctx.adminClient.auth.admin.generateLink({ type: 'signup', email: authUser.email });
        if (error) throw new InternalError(error.message);
        await queueSecurityNotification(ctx.adminClient, 'VerificationSent', {
          userId,
          actorId: ctx.actor.id,
        }, ctx.logger);
        return { ...base, status: 'success' };
      }
      case 'send_invite': {
        await assertCanManageAccountSecurity(ctx.adminClient, ctx.actor.id, userId);
        if (!payload.role) throw new ConflictError('Role is required for invitation');
        const authUser = await getAuthUserEmail(ctx.adminClient, userId);
        const { data: role, error: roleError } = await ctx.adminClient
          .from('roles')
          .select('id')
          .eq('name', payload.role)
          .maybeSingle();
        if (roleError || !role) throw new NotFoundError('Role not found');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const { error } = await ctx.adminClient.from('role_invitations').insert({
          email: authUser.email,
          role_id: role.id,
          invited_by: ctx.actor.id,
          status: 'pending',
          expires_at: expiresAt,
        });
        if (error) throw new InternalError(error.message);
        await queueSecurityNotification(ctx.adminClient, 'InviteSent', {
          userId,
          actorId: ctx.actor.id,
        }, ctx.logger);
        return { ...base, status: 'success' };
      }
      case 'bulk_edit': {
        if (!payload.fields || Object.keys(payload.fields).length === 0) {
          return { ...base, status: 'skipped', reason: 'No fields to update' };
        }
        await assertCanManageAccountSecurity(ctx.adminClient, ctx.actor.id, userId);
        const { error } = await ctx.adminClient
          .from('profiles')
          .update({ ...payload.fields, updated_at: new Date().toISOString() })
          .eq('id', userId);
        if (error) throw new InternalError(error.message);
        return { ...base, status: 'success' };
      }
      default:
        return { ...base, status: 'failed', reason: 'Unsupported operation' };
    }
  } catch (error) {
    return { ...base, status: 'failed', reason: mapErrorReason(error) };
  }
}

export async function executeBulkOperation(
  ctx: EnterpriseHandlerContext,
  operation: BulkUserOperation,
  userIds: string[],
  payload: BulkOperationPayload,
  options?: { parentAuditId?: string; startIndex?: number; existingResults?: BulkUserResult[]; cancelled?: boolean },
): Promise<{ parentAuditId: string; progress: BulkOperationProgress }> {
  const parentAuditId = options?.parentAuditId ?? crypto.randomUUID();
  const results: BulkUserResult[] = [...(options?.existingResults ?? [])];
  let completed = results.filter((r) => r.status === 'success').length;
  let failed = results.filter((r) => r.status === 'failed').length;
  let skipped = results.filter((r) => r.status === 'skipped').length;

  if (!options?.parentAuditId) {
    await writeAuditLog(
      ctx.adminClient,
      ctx.requestContext,
      {
        action: 'bulk_operation',
        entity: 'user',
        targetType: 'user',
        metadata: { operation, userCount: userIds.length, parentAuditId },
      },
      ctx.logger,
    );
  }

  const startIndex = options?.startIndex ?? 0;
  for (let index = startIndex; index < userIds.length; index += 1) {
    if (options?.cancelled) break;
    const userId = userIds[index];
    const result = await processSingleUser(ctx, operation, userId, payload);
    results.push(result);
    if (result.status === 'success') completed += 1;
    else if (result.status === 'skipped') skipped += 1;
    else failed += 1;
    await writeChildAudit(ctx, parentAuditId, operation, result);
  }

  await enqueueJob(
    ctx.adminClient,
    {
      jobType: 'notification',
      payload: {
        eventType: 'BulkOperationCompleted',
        operation,
        parentAuditId,
        completed,
        failed,
        skipped,
        actorId: ctx.actor.id,
      },
    },
    ctx.logger,
  );

  return {
    parentAuditId,
    progress: {
      completed,
      failed,
      skipped,
      total: userIds.length,
      currentUserId: null,
      results,
      cancelled: options?.cancelled,
    },
  };
}

export function shouldRunBulkAsync(userCount: number): boolean {
  return userCount > SYNC_THRESHOLD;
}

export async function getJobProgress(
  adminClient: SupabaseClient,
  jobId: string,
): Promise<{ status: string; progress?: BulkOperationProgress; error?: string } | null> {
  const { data, error } = await adminClient
    .from('background_jobs')
    .select('status, payload, last_error')
    .eq('id', jobId)
    .maybeSingle();

  if (error || !data) return null;
  const payload = (data.payload ?? {}) as Record<string, unknown>;
  return {
    status: data.status as string,
    progress: payload.progress as BulkOperationProgress | undefined,
    error: data.last_error ?? undefined,
  };
}

export async function updateJobProgress(
  adminClient: SupabaseClient,
  jobId: string,
  progress: BulkOperationProgress,
): Promise<void> {
  const { data } = await adminClient.from('background_jobs').select('payload').eq('id', jobId).maybeSingle();
  const payload = (data?.payload ?? {}) as Record<string, unknown>;
  await adminClient
    .from('background_jobs')
    .update({
      payload: { ...payload, progress },
      updated_at: new Date().toISOString(),
    })
    .eq('id', jobId);
}

export { SYNC_THRESHOLD as BULK_SYNC_THRESHOLD };
