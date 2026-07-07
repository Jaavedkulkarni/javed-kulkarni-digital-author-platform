import { InternalError } from '../_shared/errors/app-error.ts';
import { createEnterpriseHandler, emitDomainEventAndAudit } from '../_shared/handler-enterprise.ts';
import { enqueueJob } from '../_shared/jobs/queue.ts';
import {
  assertCanManageAccountSecurity,
  assertCanResetPassword,
  getAuthUserEmail,
} from '../_shared/security/account-security.ts';
import {
  queueSecurityNotification,
  readLastPasswordChange,
  writeLastPasswordChange,
} from '../_shared/security/security-state.ts';
import {
  clearTemporaryPasswordMetadata,
  generateTemporaryPassword,
  getTemporaryPasswordStatus,
  setTemporaryPasswordMetadata,
} from '../_shared/temp-password/manager.ts';
import { assertProfileExists } from '../_shared/permissions/checks.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import { validateResetPasswordRequest } from '../_shared/validation/security-requests.ts';

Deno.serve(
  createEnterpriseHandler('reset-password', { permission: 'super_admin' }, async (ctx) => {
    const payload = validateResetPasswordRequest(ctx.body);
    await assertProfileExists(ctx.adminClient, payload.userId);

    const authUser = await getAuthUserEmail(ctx.adminClient, payload.userId);
    const tempStatus = await getTemporaryPasswordStatus(ctx.adminClient, payload.userId);
    const lastPasswordChange = await readLastPasswordChange(ctx.adminClient, payload.userId);

    if (payload.action === 'get_status') {
      return jsonSuccess({
        password: {
          temporaryPasswordActive: tempStatus?.tempPasswordActive ?? false,
          temporaryPasswordExpiresAt: tempStatus?.tempPasswordExpiresAt ?? null,
          forcePasswordChange: tempStatus?.forcePasswordChange ?? false,
          firstLoginRequired: tempStatus?.firstLoginRequired ?? false,
          passwordRotationDueAt: tempStatus?.passwordRotationDueAt ?? null,
          lastPasswordChange,
        },
        email: {
          verified: Boolean(authUser.emailConfirmedAt),
          verificationDate: authUser.emailConfirmedAt,
          pending: !authUser.emailConfirmedAt,
        },
      });
    }

    const securityActions = ['mark_verified', 'revoke_verification', 'resend_verification'];
    if (securityActions.includes(payload.action)) {
      await assertCanManageAccountSecurity(ctx.adminClient, ctx.actor.id, payload.userId);
    } else {
      await assertCanResetPassword(ctx.adminClient, ctx.actor.id, payload.userId);
    }

    let result: Record<string, unknown> = {};

    switch (payload.action) {
      case 'reset_password': {
        const { data, error } = await ctx.adminClient.auth.admin.generateLink({
          type: 'recovery',
          email: authUser.email,
        });
        if (error || !data) throw new InternalError(error?.message ?? 'Failed to generate reset link');
        await queueSecurityNotification(ctx.adminClient, 'PasswordResetRequested', {
          userId: payload.userId,
          actorId: ctx.actor.id,
        }, ctx.logger);
        result = { resetLinkGenerated: true };
        break;
      }
      case 'generate_temporary_password': {
        const password = generateTemporaryPassword();
        const { error } = await ctx.adminClient.auth.admin.updateUserById(payload.userId, { password });
        if (error) throw new InternalError(error.message);
        await setTemporaryPasswordMetadata(ctx.adminClient, payload.userId, ctx.actor.id, {
          forcePasswordChange: true,
          firstLoginRequired: true,
        });
        await writeLastPasswordChange(ctx.adminClient, payload.userId);
        result = { temporaryPassword: password };
        break;
      }
      case 'force_password_change': {
        await setTemporaryPasswordMetadata(ctx.adminClient, payload.userId, ctx.actor.id, {
          forcePasswordChange: true,
          firstLoginRequired: true,
          ttlHours: 168,
        });
        result = { forcePasswordChange: true };
        break;
      }
      case 'expire_temporary_password': {
        await clearTemporaryPasswordMetadata(ctx.adminClient, payload.userId);
        result = { temporaryPasswordExpired: true };
        break;
      }
      case 'resend_verification': {
        const { error } = await ctx.adminClient.auth.admin.generateLink({
          type: 'signup',
          email: authUser.email,
        });
        if (error) throw new InternalError(error.message);
        await queueSecurityNotification(ctx.adminClient, 'VerificationSent', {
          userId: payload.userId,
          actorId: ctx.actor.id,
        }, ctx.logger);
        result = { verificationSent: true };
        break;
      }
      case 'mark_verified': {
        const { error } = await ctx.adminClient.auth.admin.updateUserById(payload.userId, {
          email_confirm: true,
        });
        if (error) throw new InternalError(error.message);
        await ctx.adminClient.from('profiles').update({
          status: 'active',
          updated_at: new Date().toISOString(),
        }).eq('id', payload.userId);
        result = { verified: true };
        break;
      }
      case 'revoke_verification': {
        await ctx.adminClient.from('profiles').update({
          status: 'pending',
          updated_at: new Date().toISOString(),
        }).eq('id', payload.userId);
        result = { verified: false };
        break;
      }
      default:
        throw new InternalError('Unsupported action');
    }

    await emitDomainEventAndAudit(ctx, {
      eventType: payload.action.includes('verification') ? 'UserUpdated' : 'PasswordReset',
      payload: { userId: payload.userId, action: payload.action },
      audit: {
        action: payload.action.includes('verification') ? 'update' : 'password_reset',
        entity: 'user',
        targetId: payload.userId,
        targetType: 'user',
        afterState: result,
      },
      activity: {
        targetId: payload.userId,
        targetType: 'user',
        activityType: payload.action.includes('verification') ? 'update' : 'password_reset',
        description: payload.action.replace(/_/g, ' '),
      },
    });

    return jsonSuccess(result);
  }),
);
