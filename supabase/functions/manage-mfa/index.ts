import { InternalError } from '../_shared/errors/app-error.ts';
import { createEnterpriseHandler, emitDomainEventAndAudit } from '../_shared/handler-enterprise.ts';
import { assertCanManageAccountSecurity } from '../_shared/security/account-security.ts';
import { queueSecurityNotification, readMfaState, writeMfaState } from '../_shared/security/security-state.ts';
import { assertProfileExists } from '../_shared/permissions/checks.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import { validateManageMfaRequest } from '../_shared/validation/security-requests.ts';

Deno.serve(
  createEnterpriseHandler('manage-mfa', { permission: 'super_admin' }, async (ctx) => {
    const payload = validateManageMfaRequest(ctx.body);
    await assertProfileExists(ctx.adminClient, payload.userId);

    if (payload.action === 'get_status') {
      const mfa = await readMfaState(ctx.adminClient, payload.userId);
      return jsonSuccess({ mfa });
    }

    await assertCanManageAccountSecurity(ctx.adminClient, ctx.actor.id, payload.userId);

    let mfaUpdate: Record<string, unknown> = {};

    switch (payload.action) {
      case 'reset':
        mfaUpdate = { enabled: false, method: null, recoveryCodesStatus: 'none', required: true };
        await writeMfaState(ctx.adminClient, payload.userId, mfaUpdate);
        await queueSecurityNotification(ctx.adminClient, 'MFAReset', {
          userId: payload.userId,
          actorId: ctx.actor.id,
        }, ctx.logger);
        break;
      case 'disable':
        mfaUpdate = { enabled: false, method: null, recoveryCodesStatus: 'none', required: false };
        await writeMfaState(ctx.adminClient, payload.userId, mfaUpdate);
        break;
      case 'require':
        mfaUpdate = { required: true };
        await writeMfaState(ctx.adminClient, payload.userId, mfaUpdate);
        break;
      default:
        throw new InternalError('Unsupported action');
    }

    const mfa = await readMfaState(ctx.adminClient, payload.userId);

    await emitDomainEventAndAudit(ctx, {
      eventType: 'UserUpdated',
      payload: { userId: payload.userId, action: payload.action, mfa },
      audit: {
        action: 'update',
        entity: 'user',
        targetId: payload.userId,
        targetType: 'user',
        afterState: mfa as unknown as Record<string, unknown>,
        metadata: { mfaAction: payload.action },
      },
      activity: {
        targetId: payload.userId,
        targetType: 'user',
        activityType: 'update',
        description: `MFA ${payload.action}`,
      },
    });

    return jsonSuccess({ mfa });
  }),
);
