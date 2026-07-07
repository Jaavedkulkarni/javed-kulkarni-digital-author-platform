import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import { ConflictError, InternalError } from '../_shared/errors/app-error.ts';
import { writeActivityLog } from '../_shared/audit/writer.ts';
import { createEnterpriseHandler, emitDomainEventAndAudit } from '../_shared/handler-enterprise.ts';
import { assertProfileExists } from '../_shared/permissions/checks.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import { buildFullName, validateUpdateUserRequest } from '../_shared/validation/user-requests.ts';

function splitFullName(fullName: string | null): { firstName: string; lastName: string } {
  const normalized = (fullName ?? '').trim();
  if (!normalized) return { firstName: '', lastName: '' };
  const parts = normalized.split(/\s+/);
  return { firstName: parts[0] ?? '', lastName: parts.slice(1).join(' ') };
}

async function applyRoleChanges(
  userClient: SupabaseClient,
  targetUserId: string,
  assignRoles: string[],
  removeRoles: string[],
  primaryRole: string | undefined,
  reason: string | undefined,
): Promise<string[]> {
  const changedRoles: string[] = [];

  for (const role of removeRoles) {
    const { error } = await userClient.rpc('apply_user_role_change', {
      p_target_user_id: targetUserId,
      p_role_name: role,
      p_action: 'remove',
      p_reason: reason ?? 'Role removed by Super Admin',
    });
    if (error && !error.message.includes('Role not assigned')) {
      throw error;
    }
    if (!error) changedRoles.push(`removed:${role}`);
  }

  const rolesToAssign = [...assignRoles];
  if (primaryRole && !rolesToAssign.includes(primaryRole)) {
    rolesToAssign.push(primaryRole);
  }

  for (const role of rolesToAssign) {
    const { error } = await userClient.rpc('apply_user_role_change', {
      p_target_user_id: targetUserId,
      p_role_name: role,
      p_action: 'assign',
      p_reason: reason ?? 'Role assigned by Super Admin',
    });
    if (error && !error.message.includes('Role already assigned')) {
      throw error;
    }
    if (!error) changedRoles.push(`assigned:${role}`);
  }

  return changedRoles;
}

Deno.serve(
  createEnterpriseHandler('update-user', { permission: 'super_admin' }, async (ctx) => {
    const payload = validateUpdateUserRequest(ctx.body);
    const before = await assertProfileExists(ctx.adminClient, payload.userId);

    const { data: currentProfile, error: readError } = await ctx.adminClient
      .from('profiles')
      .select('full_name, email, status, phone, preferred_language, timezone')
      .eq('id', payload.userId)
      .single();

    if (readError || !currentProfile) {
      throw new InternalError(readError?.message ?? 'Failed to load profile');
    }

    if (payload.phone) {
      const { data: phoneConflict } = await ctx.adminClient
        .from('profiles')
        .select('id')
        .eq('phone', payload.phone)
        .neq('id', payload.userId)
        .maybeSingle();

      if (phoneConflict) {
        throw new ConflictError('A user with this phone number already exists');
      }
    }

    const currentName = splitFullName(currentProfile.full_name);
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    const previousStatus = currentProfile.status;

    if (payload.firstName !== undefined || payload.lastName !== undefined || payload.displayName !== undefined) {
      update.full_name = buildFullName(
        payload.firstName ?? currentName.firstName,
        payload.lastName ?? currentName.lastName,
        payload.displayName,
      );
    }
    if (payload.phone !== undefined) update.phone = payload.phone;
    if (payload.status !== undefined) update.status = payload.status;
    if (payload.language !== undefined) update.preferred_language = payload.language;
    if (payload.timezone !== undefined) update.timezone = payload.timezone;

    const hasProfilePatch = Object.keys(update).length > 1;

    let profileData = currentProfile;
    if (hasProfilePatch) {
      const { data, error } = await ctx.adminClient
        .from('profiles')
        .update(update)
        .eq('id', payload.userId)
        .select('id, email, full_name, status, phone, preferred_language, timezone')
        .single();

      if (error || !data) throw new InternalError(error?.message ?? 'Failed to update profile');
      profileData = data;
    }

    if (payload.internalNotes !== undefined) {
      const { data: existingSecurity } = await ctx.adminClient
        .from('user_security')
        .select('metadata')
        .eq('user_id', payload.userId)
        .maybeSingle();

      const mergedMetadata = {
        ...((existingSecurity?.metadata as Record<string, unknown> | null) ?? {}),
        internal_notes: payload.internalNotes,
      };

      const { error: notesError } = await ctx.adminClient.from('user_security').upsert({
        user_id: payload.userId,
        metadata: mergedMetadata,
        updated_at: new Date().toISOString(),
      });
      if (notesError) {
        throw new InternalError(notesError.message);
      }
    }

    const roleChanges = await applyRoleChanges(
      ctx.userClient,
      payload.userId,
      payload.assignRoles ?? [],
      payload.removeRoles ?? [],
      payload.primaryRole,
      payload.reason,
    );

    await emitDomainEventAndAudit(ctx, {
      eventType: 'UserUpdated',
      payload: { userId: payload.userId, roleChanges },
      audit: {
        action: 'update',
        entity: 'user',
        targetId: payload.userId,
        targetType: 'user',
        beforeState: currentProfile as Record<string, unknown>,
        afterState: profileData as Record<string, unknown>,
      },
      activity: {
        targetId: payload.userId,
        targetType: 'user',
        activityType: 'update',
        description: 'User profile updated',
      },
    });

    if (payload.status !== undefined && payload.status !== previousStatus) {
      await writeActivityLog(ctx.adminClient, ctx.requestContext, {
        targetId: payload.userId,
        targetType: 'user',
        activityType: 'update',
        description: `Status changed to ${payload.status}`,
        metadata: { previousStatus, newStatus: payload.status },
      }, ctx.logger);
    }

    if (roleChanges.length > 0) {
      await writeActivityLog(ctx.adminClient, ctx.requestContext, {
        targetId: payload.userId,
        targetType: 'user',
        activityType: 'role_change',
        description: 'User roles updated',
        metadata: { roleChanges },
      }, ctx.logger);
    }

    return jsonSuccess({
      profile: profileData,
      previousStatus: before.status,
      roleChanges,
    });
  }),
);
