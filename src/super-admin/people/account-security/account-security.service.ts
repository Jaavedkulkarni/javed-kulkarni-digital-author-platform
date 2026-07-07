import { invokeEdgeFunctionOrThrow } from '../../../lib/edge-functions';
import { createIdempotencyKey } from '../../../enterprise/idempotency/idempotency-key';
import type {
  AccountLockStatus,
  AccountSecuritySnapshot,
  EmailSecurityStatus,
  GenerateTemporaryPasswordResult,
  InvitationAction,
  MfaAction,
  MfaSecurityStatus,
  PasswordSecurityStatus,
  ResetPasswordAction,
  SessionAction,
  UnlockAction,
  UserInvitationInfo,
  UserSessionInfo,
} from './account-security.types';

function invokeSecurity<T>(
  functionName: string,
  body: Record<string, unknown>,
): Promise<T> {
  return invokeEdgeFunctionOrThrow<T>(functionName, body, {
    idempotencyKey: createIdempotencyKey(functionName),
  });
}

export class AccountSecurityService {
  async fetchSnapshot(userId: string): Promise<AccountSecuritySnapshot> {
    const [passwordRes, sessionsRes, mfaRes, lockRes, invitationsRes] = await Promise.all([
      invokeSecurity<{ password: PasswordSecurityStatus; email: EmailSecurityStatus }>('reset-password', {
        userId,
        action: 'get_status',
      }),
      invokeSecurity<{ sessions: UserSessionInfo[] }>('manage-sessions', { userId, action: 'list' }),
      invokeSecurity<{ mfa: MfaSecurityStatus }>('manage-mfa', { userId, action: 'get_status' }),
      invokeSecurity<{ accountLock: AccountLockStatus }>('unlock-account', { userId, action: 'get_status' }),
      invokeSecurity<{ invitations: UserInvitationInfo[] }>('manage-invitation', { userId, action: 'list' }),
    ]);

    return {
      password: passwordRes.password,
      email: passwordRes.email,
      sessions: sessionsRes.sessions,
      mfa: mfaRes.mfa,
      accountLock: lockRes.accountLock,
      invitations: invitationsRes.invitations,
    };
  }

  resetPassword(userId: string, action: ResetPasswordAction) {
    return invokeSecurity('reset-password', { userId, action });
  }

  generateTemporaryPassword(userId: string) {
    return invokeSecurity<GenerateTemporaryPasswordResult>('reset-password', {
      userId,
      action: 'generate_temporary_password',
    });
  }

  manageInvitation(
    userId: string,
    action: InvitationAction,
    options?: { invitationId?: string; role?: string },
  ) {
    return invokeSecurity('manage-invitation', { userId, action, ...options });
  }

  manageSessions(userId: string, action: SessionAction, sessionId?: string) {
    return invokeSecurity('manage-sessions', { userId, action, sessionId });
  }

  manageMfa(userId: string, action: MfaAction) {
    return invokeSecurity('manage-mfa', { userId, action });
  }

  unlockAccount(userId: string, action: UnlockAction) {
    return invokeSecurity('unlock-account', { userId, action });
  }
}

let accountSecurityService: AccountSecurityService | null = null;

export function getAccountSecurityService(): AccountSecurityService {
  if (!accountSecurityService) accountSecurityService = new AccountSecurityService();
  return accountSecurityService;
}

export default AccountSecurityService;
