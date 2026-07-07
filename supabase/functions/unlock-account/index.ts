import { InternalError } from '../_shared/errors/app-error.ts';
import { createEnterpriseHandler, emitDomainEventAndAudit } from '../_shared/handler-enterprise.ts';
import {
  assertCanManageAccountSecurity,
  getAuthUserEmail,
} from '../_shared/security/account-security.ts';
import {
  readAccountLockState,
  writeAccountLockState,
} from '../_shared/security/security-state.ts';
import { assertProfileExists } from '../_shared/permissions/checks.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import { validateUnlockAccountRequest } from '../_shared/validation/security-requests.ts';

Deno.serve(
  createEnterpriseHandler('unlock-account', { permission: 'super_admin' }, async (ctx) => {
    const payload = validateUnlockAccountRequest(ctx.body);
    await assertProfileExists(ctx.adminClient, payload.userId);
    const authUser = await getAuthUserEmail(ctx.adminClient, payload.userId);

    if (payload.action === 'get_status') {
      const accountLock = await readAccountLockState(
        ctx.adminClient,
        payload.userId,
        authUser.bannedUntil,
      );
      return jsonSuccess({ accountLock });
    }

    await assertCanManageAccountSecurity(ctx.adminClient, ctx.actor.id, payload.userId);

    const current = await readAccountLockState(
      ctx.adminClient,
      payload.userId,
      authUser.bannedUntil,
    );

    if (payload.action === 'unlock') {
      await ctx.adminClient.auth.admin.updateUserById(payload.userId, {
        ban_duration: 'none',
      });
      await writeAccountLockState(ctx.adminClient, payload.userId, {
        locked: false,
        failedAttempts: current.failedAttempts,
        lastFailedLogin: current.lastFailedLogin,
      });
    } else if (payload.action === 'reset_failed_attempts') {
      await writeAccountLockState(ctx.adminClient, payload.userId, {
        locked: false,
        failedAttempts: 0,
        lastFailedLogin: null,
      });
    }

    const accountLock = await readAccountLockState(
      ctx.adminClient,
      payload.userId,
      null,
    );

    await emitDomainEventAndAudit(ctx, {
      eventType: 'UserUpdated',
      payload: { userId: payload.userId, action: payload.action, accountLock },
      audit: {
        action: 'update',
        entity: 'user',
        targetId: payload.userId,
        targetType: 'user',
        beforeState: current as unknown as Record<string, unknown>,
        afterState: accountLock as unknown as Record<string, unknown>,
        metadata: { unlockAction: payload.action },
      },
      activity: {
        targetId: payload.userId,
        targetType: 'user',
        activityType: 'update',
        description: 'Account unlocked',
        metadata: { action: payload.action },
      },
    });

    return jsonSuccess({ accountLock });
  }),
);
