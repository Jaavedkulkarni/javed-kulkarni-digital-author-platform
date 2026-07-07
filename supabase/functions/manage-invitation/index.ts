import { ConflictError, InternalError, NotFoundError } from '../_shared/errors/app-error.ts';
import { createEnterpriseHandler, emitDomainEventAndAudit } from '../_shared/handler-enterprise.ts';
import { assertCanManageAccountSecurity, getAuthUserEmail } from '../_shared/security/account-security.ts';
import { queueSecurityNotification } from '../_shared/security/security-state.ts';
import { assertProfileExists } from '../_shared/permissions/checks.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import { validateManageInvitationRequest } from '../_shared/validation/security-requests.ts';

function mapInvitation(row: Record<string, unknown>) {
  return {
    id: row.id,
    email: row.email,
    status: row.status,
    sentDate: row.created_at,
    acceptedDate: row.accepted_at ?? null,
    expiresAt: row.expires_at,
    role: (row.roles as { name?: string } | null)?.name ?? null,
  };
}

Deno.serve(
  createEnterpriseHandler('manage-invitation', { permission: 'super_admin' }, async (ctx) => {
    const payload = validateManageInvitationRequest(ctx.body);
    const profile = await assertProfileExists(ctx.adminClient, payload.userId);
    const authUser = await getAuthUserEmail(ctx.adminClient, payload.userId);

    if (payload.action === 'list') {
      const { data, error } = await ctx.adminClient
        .from('role_invitations')
        .select('id, email, status, created_at, accepted_at, expires_at, roles(name)')
        .eq('email', authUser.email)
        .order('created_at', { ascending: false });

      if (error) throw new InternalError(error.message);
      return jsonSuccess({ invitations: (data ?? []).map((row) => mapInvitation(row as Record<string, unknown>)) });
    }

    await assertCanManageAccountSecurity(ctx.adminClient, ctx.actor.id, payload.userId);

    let result: Record<string, unknown> = {};

    switch (payload.action) {
      case 'send': {
        if (!payload.role) throw new ConflictError('role is required to send an invitation');
        const { data: role, error: roleError } = await ctx.adminClient
          .from('roles')
          .select('id')
          .eq('name', payload.role)
          .maybeSingle();
        if (roleError || !role) throw new NotFoundError('Role not found');

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const { data, error } = await ctx.adminClient
          .from('role_invitations')
          .insert({
            email: authUser.email,
            role_id: role.id,
            invited_by: ctx.actor.id,
            status: 'pending',
            expires_at: expiresAt,
          })
          .select('id, email, status, created_at, accepted_at, expires_at, roles(name)')
          .single();

        if (error || !data) throw new InternalError(error?.message ?? 'Failed to create invitation');
        await queueSecurityNotification(ctx.adminClient, 'InviteSent', {
          userId: payload.userId,
          invitationId: data.id,
          actorId: ctx.actor.id,
        }, ctx.logger);
        result = { invitation: mapInvitation(data as Record<string, unknown>) };
        break;
      }
      case 'resend':
      case 'regenerate': {
        if (!payload.invitationId) throw new ConflictError('invitationId is required');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const token = crypto.randomUUID().replace(/-/g, '');
        const { data, error } = await ctx.adminClient
          .from('role_invitations')
          .update({
            status: 'pending',
            expires_at: expiresAt,
            token,
            accepted_at: null,
          })
          .eq('id', payload.invitationId)
          .eq('email', authUser.email)
          .select('id, email, status, created_at, accepted_at, expires_at, roles(name)')
          .single();

        if (error || !data) throw new InternalError(error?.message ?? 'Failed to update invitation');
        await queueSecurityNotification(ctx.adminClient, payload.action === 'resend' ? 'InviteResent' : 'InviteSent', {
          userId: payload.userId,
          invitationId: data.id,
          actorId: ctx.actor.id,
        }, ctx.logger);
        result = { invitation: mapInvitation(data as Record<string, unknown>) };
        break;
      }
      case 'cancel': {
        if (!payload.invitationId) throw new ConflictError('invitationId is required');
        const { data, error } = await ctx.adminClient
          .from('role_invitations')
          .update({ status: 'revoked' })
          .eq('id', payload.invitationId)
          .eq('email', authUser.email)
          .select('id, status')
          .single();
        if (error || !data) throw new InternalError(error?.message ?? 'Failed to cancel invitation');
        result = { cancelled: true, invitationId: data.id };
        break;
      }
      default:
        throw new InternalError('Unsupported action');
    }

    await emitDomainEventAndAudit(ctx, {
      eventType: 'InviteSent',
      payload: { userId: payload.userId, action: payload.action },
      audit: {
        action: 'update',
        entity: 'invitation',
        targetId: payload.userId,
        targetType: 'user',
        beforeState: profile as Record<string, unknown>,
        afterState: result,
      },
      activity: {
        targetId: payload.userId,
        targetType: 'user',
        activityType: 'invite',
        description: `Invitation ${payload.action}`,
      },
    });

    return jsonSuccess(result);
  }),
);
