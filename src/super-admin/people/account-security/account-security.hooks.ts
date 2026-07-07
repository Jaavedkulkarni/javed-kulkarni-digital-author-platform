import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../context/ToastContext';
import { mapEdgeFunctionInvokeError } from '../../../lib/edge-functions';
import { copyTemporaryPasswordToClipboard } from '../../../enterprise/temp-password/temp-password';
import { useInvalidatePeople } from '../hooks';
import { PEOPLE_QUERY_STALE_TIME_MS } from '../constants/people.constants';
import { mapAccountSecurityErrorToMessage } from './account-security.errors';
import { accountSecurityQueryKeys } from './account-security.queries';
import { getAccountSecurityService } from './account-security.service';
import type { AccountSecuritySnapshot } from './account-security.types';

export function useAccountSecuritySnapshot(userId: string | null, enabled = true) {
  const service = useMemo(() => getAccountSecurityService(), []);

  return useQuery({
    queryKey: userId ? accountSecurityQueryKeys.snapshot(userId) : accountSecurityQueryKeys.all(''),
    queryFn: async (): Promise<AccountSecuritySnapshot> => {
      if (!userId) throw new Error('User id is required');
      return service.fetchSnapshot(userId);
    },
    enabled: Boolean(userId) && enabled,
    staleTime: PEOPLE_QUERY_STALE_TIME_MS,
  });
}

export function useAccountSecurityActions(userId: string) {
  const { showToast } = useToast();
  const { invalidateEverything, invalidateDetail, invalidateSecurity, invalidateSessions, invalidateTimelines } =
    useInvalidatePeople();
  const service = useMemo(() => getAccountSecurityService(), []);
  const [lastTemporaryPassword, setLastTemporaryPassword] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const invalidateSecurityPanel = useCallback(async () => {
    await Promise.all([
      invalidateSecurity(userId),
      invalidateSessions(userId),
      invalidateTimelines(userId),
      invalidateDetail(userId),
      invalidateEverything(),
    ]);
  }, [invalidateDetail, invalidateEverything, invalidateSecurity, invalidateSessions, invalidateTimelines, userId]);

  const runAction = useCallback(
    async (actionKey: string, operation: () => Promise<unknown>, successMessage: string) => {
      setPendingAction(actionKey);
      try {
        await operation();
        showToast(successMessage);
        await invalidateSecurityPanel();
      } catch (error) {
        const message =
          (await mapEdgeFunctionInvokeError(error).catch(() => null)) ??
          mapAccountSecurityErrorToMessage(error);
        showToast(message);
      } finally {
        setPendingAction(null);
      }
    },
    [invalidateSecurityPanel, showToast],
  );

  const generateTempPassword = useMutation({
    mutationFn: () => service.generateTemporaryPassword(userId),
    onMutate: () => setPendingAction('generate_temporary_password'),
    onSuccess: async (data) => {
      if (data.temporaryPassword) setLastTemporaryPassword(data.temporaryPassword);
      showToast('Temporary password generated');
      await invalidateSecurityPanel();
    },
    onError: async (error) => {
      showToast(mapAccountSecurityErrorToMessage(error));
    },
    onSettled: () => setPendingAction(null),
  });

  const copyTemporaryPassword = useCallback(async () => {
    if (!lastTemporaryPassword) {
      showToast('Generate a temporary password first');
      return;
    }
    try {
      await copyTemporaryPasswordToClipboard(lastTemporaryPassword);
      showToast('Temporary password copied');
    } catch {
      showToast('Unable to copy password to clipboard');
    }
  }, [lastTemporaryPassword, showToast]);

  return {
    pendingAction,
    lastTemporaryPassword,
    copyTemporaryPassword,
    resetPassword: () =>
      runAction('reset_password', () => service.resetPassword(userId, 'reset_password'), 'Password reset requested'),
    generateTemporaryPassword: () => generateTempPassword.mutate(),
    forcePasswordChange: () =>
      runAction('force_password_change', () => service.resetPassword(userId, 'force_password_change'), 'Password change required on next login'),
    expireTemporaryPassword: () =>
      runAction('expire_temporary_password', () => service.resetPassword(userId, 'expire_temporary_password'), 'Temporary password expired'),
    resendVerification: () =>
      runAction('resend_verification', () => service.resetPassword(userId, 'resend_verification'), 'Verification email sent'),
    markVerified: () =>
      runAction('mark_verified', () => service.resetPassword(userId, 'mark_verified'), 'Email marked as verified'),
    revokeVerification: () =>
      runAction('revoke_verification', () => service.resetPassword(userId, 'revoke_verification'), 'Email verification revoked'),
    sendInvite: (role: string) =>
      runAction('send_invite', () => service.manageInvitation(userId, 'send', { role }), 'Invitation sent'),
    resendInvite: (invitationId: string) =>
      runAction('resend_invite', () => service.manageInvitation(userId, 'resend', { invitationId }), 'Invitation resent'),
    cancelInvite: (invitationId: string) =>
      runAction('cancel_invite', () => service.manageInvitation(userId, 'cancel', { invitationId }), 'Invitation cancelled'),
    regenerateInvite: (invitationId: string) =>
      runAction('regenerate_invite', () => service.manageInvitation(userId, 'regenerate', { invitationId }), 'Invitation regenerated'),
    revokeSession: (sessionId: string) =>
      runAction('revoke_session', () => service.manageSessions(userId, 'revoke_session', sessionId), 'Session revoked'),
    revokeAllSessions: () =>
      runAction('revoke_all', () => service.manageSessions(userId, 'revoke_all'), 'All sessions revoked'),
    resetMfa: () => runAction('reset_mfa', () => service.manageMfa(userId, 'reset'), 'MFA reset'),
    disableMfa: () => runAction('disable_mfa', () => service.manageMfa(userId, 'disable'), 'MFA disabled'),
    requireMfa: () => runAction('require_mfa', () => service.manageMfa(userId, 'require'), 'MFA required'),
    unlockAccount: () => runAction('unlock', () => service.unlockAccount(userId, 'unlock'), 'Account unlocked'),
    resetFailedAttempts: () =>
      runAction('reset_failed_attempts', () => service.unlockAccount(userId, 'reset_failed_attempts'), 'Failed login attempts reset'),
  };
}

export function useInvalidateAccountSecurity() {
  const { invalidateSecurity, invalidateSessions } = useInvalidatePeople();
  const queryClient = useQueryClient();
  return {
    invalidateSecurity: (userId: string) =>
      Promise.all([
        invalidateSecurity(userId),
        invalidateSessions(userId),
        queryClient.invalidateQueries({ queryKey: accountSecurityQueryKeys.snapshot(userId) }),
      ]),
  };
}
