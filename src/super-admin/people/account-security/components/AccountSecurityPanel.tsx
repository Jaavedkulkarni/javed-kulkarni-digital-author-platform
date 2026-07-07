import { memo, useCallback, useState } from 'react';
import {
  ACCOUNT_SECURITY_INPUT_CLASS,
  ACCOUNT_SECURITY_LABEL_CLASS,
  ACCOUNT_SECURITY_SECTION_CLASS,
  DEFAULT_INVITE_ROLE,
} from '../account-security.constants';
import {
  useAccountSecurityActions,
  useAccountSecuritySnapshot,
} from '../account-security.hooks';
import type { AccountSecuritySnapshot, UserInvitationInfo, UserSessionInfo } from '../account-security.types';

interface AccountSecurityPanelProps {
  userId: string;
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function StatusBadge({ active, activeLabel, inactiveLabel }: { active: boolean; activeLabel: string; inactiveLabel: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
        active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
      }`}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      {description ? <p className="mt-1 text-xs text-gray-500">{description}</p> : null}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <span className={ACCOUNT_SECURITY_LABEL_CLASS}>{label}</span>
      <span className="text-sm text-gray-200">{value}</span>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled,
  variant = 'default',
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger';
}) {
  const dangerClass =
    variant === 'danger'
      ? 'border-red-500/40 text-red-300 hover:bg-red-500/10'
      : '';
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${ACCOUNT_SECURITY_INPUT_CLASS} ${dangerClass}`}
    >
      {label}
    </button>
  );
}

function PasswordSection({
  snapshot,
  actions,
  pendingAction,
  hasTemporaryPassword,
}: {
  snapshot: AccountSecuritySnapshot;
  actions: ReturnType<typeof useAccountSecurityActions>;
  pendingAction: string | null;
  hasTemporaryPassword: boolean;
}) {
  const { password } = snapshot;
  const busy = Boolean(pendingAction);

  return (
    <section className={ACCOUNT_SECURITY_SECTION_CLASS}>
      <SectionHeader title="Password" description="Reset credentials and manage temporary password policy." />
      <div className="space-y-3">
        <InfoRow
          label="Password Status"
          value={
            password.temporaryPasswordActive
              ? 'Temporary password active'
              : password.forcePasswordChange
                ? 'Change required on next login'
                : 'Standard'
          }
        />
        <InfoRow label="Last Password Change" value={formatDateTime(password.lastPasswordChange)} />
        <InfoRow label="Password Expiry" value={formatDateTime(password.passwordRotationDueAt)} />
        {password.temporaryPasswordActive ? (
          <InfoRow label="Temp Password Expires" value={formatDateTime(password.temporaryPasswordExpiresAt)} />
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <ActionButton label="Reset Password" onClick={actions.resetPassword} disabled={busy} />
        <ActionButton label="Generate Temporary Password" onClick={actions.generateTemporaryPassword} disabled={busy} />
        <ActionButton label="Force Password Change" onClick={actions.forcePasswordChange} disabled={busy} />
        <ActionButton label="Expire Temporary Password" onClick={actions.expireTemporaryPassword} disabled={busy} />
        <ActionButton
          label="Copy Temporary Password"
          onClick={() => void actions.copyTemporaryPassword()}
          disabled={busy || !hasTemporaryPassword}
        />
      </div>
    </section>
  );
}

function EmailSection({
  snapshot,
  actions,
  pendingAction,
}: {
  snapshot: AccountSecuritySnapshot;
  actions: ReturnType<typeof useAccountSecurityActions>;
  pendingAction: string | null;
}) {
  const { email } = snapshot;
  const busy = Boolean(pendingAction);

  return (
    <section className={ACCOUNT_SECURITY_SECTION_CLASS}>
      <SectionHeader title="Email Verification" />
      <div className="space-y-3">
        <InfoRow
          label="Status"
          value={
            <StatusBadge
              active={email.verified}
              activeLabel="Verified"
              inactiveLabel={email.pending ? 'Pending' : 'Unverified'}
            />
          }
        />
        <InfoRow label="Verification Date" value={formatDateTime(email.verificationDate)} />
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <ActionButton label="Resend Verification Email" onClick={actions.resendVerification} disabled={busy || email.verified} />
        <ActionButton label="Mark Verified" onClick={actions.markVerified} disabled={busy || email.verified} />
        <ActionButton label="Revoke Verification" onClick={actions.revokeVerification} disabled={busy || !email.verified} variant="danger" />
      </div>
    </section>
  );
}

function InvitationsSection({
  snapshot,
  actions,
  pendingAction,
}: {
  snapshot: AccountSecuritySnapshot;
  actions: ReturnType<typeof useAccountSecurityActions>;
  pendingAction: string | null;
}) {
  const [inviteRole, setInviteRole] = useState(DEFAULT_INVITE_ROLE);
  const busy = Boolean(pendingAction);

  const confirmCancel = useCallback(
    (invitation: UserInvitationInfo) => {
      if (window.confirm(`Cancel invitation for ${invitation.email}?`)) {
        actions.cancelInvite(invitation.id);
      }
    },
    [actions],
  );

  return (
    <section className={ACCOUNT_SECURITY_SECTION_CLASS}>
      <SectionHeader title="Invitations" description="Manage role invitations sent to this user." />
      {snapshot.invitations.length === 0 ? (
        <p className="text-sm text-gray-500">No invitations found for this user.</p>
      ) : (
        <div className="space-y-3">
          {snapshot.invitations.map((invitation) => (
            <div key={invitation.id} className="rounded-lg border border-navy-700 bg-navy-900/40 p-3 space-y-2">
              <InfoRow label="Status" value={invitation.status} />
              <InfoRow label="Role" value={invitation.role ?? '—'} />
              <InfoRow label="Sent Date" value={formatDateTime(invitation.sentDate)} />
              <InfoRow label="Accepted Date" value={formatDateTime(invitation.acceptedDate)} />
              <InfoRow label="Expiry" value={formatDateTime(invitation.expiresAt)} />
              <div className="flex flex-wrap gap-2 pt-1">
                <ActionButton label="Resend Invite" onClick={() => actions.resendInvite(invitation.id)} disabled={busy} />
                <ActionButton label="Regenerate Invite" onClick={() => actions.regenerateInvite(invitation.id)} disabled={busy} />
                <ActionButton label="Cancel Invite" onClick={() => confirmCancel(invitation)} disabled={busy} variant="danger" />
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-end gap-2 pt-2">
        <label className="flex flex-col gap-1">
          <span className={ACCOUNT_SECURITY_LABEL_CLASS}>Role for new invite</span>
          <input
            type="text"
            value={inviteRole}
            onChange={(event) => setInviteRole(event.target.value)}
            className="min-h-9 rounded-lg border border-navy-600 bg-navy-900/60 px-3 text-sm text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
          />
        </label>
        <ActionButton label="Send Invite" onClick={() => actions.sendInvite(inviteRole.trim())} disabled={busy || !inviteRole.trim()} />
      </div>
    </section>
  );
}

function SessionsSection({
  snapshot,
  actions,
  pendingAction,
}: {
  snapshot: AccountSecuritySnapshot;
  actions: ReturnType<typeof useAccountSecurityActions>;
  pendingAction: string | null;
}) {
  const busy = Boolean(pendingAction);

  const revokeAll = useCallback(() => {
    if (window.confirm('Revoke all active sessions for this user?')) {
      actions.revokeAllSessions();
    }
  }, [actions]);

  return (
    <section className={ACCOUNT_SECURITY_SECTION_CLASS}>
      <SectionHeader title="Sessions" description="Active sign-in sessions across devices." />
      {snapshot.sessions.length === 0 ? (
        <p className="text-sm text-gray-500">No active sessions found.</p>
      ) : (
        <div className="space-y-3">
          {snapshot.sessions.map((session: UserSessionInfo) => (
            <div key={session.id} className="rounded-lg border border-navy-700 bg-navy-900/40 p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-gray-200">
                  {session.browser} · {session.operatingSystem}
                </span>
                {session.current ? (
                  <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-xs font-medium text-gold-400">
                    Current
                  </span>
                ) : null}
              </div>
              <InfoRow label="Device" value={session.device} />
              <InfoRow label="IP Address" value={session.ipAddress ?? '—'} />
              <InfoRow label="Country" value={session.country ?? '—'} />
              <InfoRow label="Last Activity" value={formatDateTime(session.lastActivity)} />
              <ActionButton
                label="Revoke Session"
                onClick={() => actions.revokeSession(session.id)}
                disabled={busy}
                variant="danger"
              />
            </div>
          ))}
        </div>
      )}
      <div className="pt-2">
        <ActionButton label="Revoke All Sessions" onClick={revokeAll} disabled={busy || snapshot.sessions.length === 0} variant="danger" />
      </div>
    </section>
  );
}

function MfaSection({
  snapshot,
  actions,
  pendingAction,
}: {
  snapshot: AccountSecuritySnapshot;
  actions: ReturnType<typeof useAccountSecurityActions>;
  pendingAction: string | null;
}) {
  const { mfa } = snapshot;
  const busy = Boolean(pendingAction);

  const resetMfa = useCallback(() => {
    if (window.confirm('Reset MFA for this user? They will need to set it up again.')) {
      actions.resetMfa();
    }
  }, [actions]);

  const disableMfa = useCallback(() => {
    if (window.confirm('Disable MFA for this user?')) {
      actions.disableMfa();
    }
  }, [actions]);

  return (
    <section className={ACCOUNT_SECURITY_SECTION_CLASS}>
      <SectionHeader title="MFA" description="Multi-factor authentication settings." />
      <div className="space-y-3">
        <InfoRow label="Enabled" value={<StatusBadge active={mfa.enabled} activeLabel="Yes" inactiveLabel="No" />} />
        <InfoRow label="Method" value={mfa.method ?? '—'} />
        <InfoRow label="Recovery Codes" value={mfa.recoveryCodesStatus} />
        <InfoRow label="Required" value={<StatusBadge active={mfa.required} activeLabel="Yes" inactiveLabel="No" />} />
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <ActionButton label="Reset MFA" onClick={resetMfa} disabled={busy} variant="danger" />
        <ActionButton label="Disable MFA" onClick={disableMfa} disabled={busy || !mfa.enabled} variant="danger" />
        <ActionButton label="Require MFA" onClick={actions.requireMfa} disabled={busy} />
      </div>
    </section>
  );
}

function AccountLockSection({
  snapshot,
  actions,
  pendingAction,
}: {
  snapshot: AccountSecuritySnapshot;
  actions: ReturnType<typeof useAccountSecurityActions>;
  pendingAction: string | null;
}) {
  const { accountLock } = snapshot;
  const busy = Boolean(pendingAction);

  return (
    <section className={ACCOUNT_SECURITY_SECTION_CLASS}>
      <SectionHeader title="Account Lock" description="Failed login attempts and lock status." />
      <div className="space-y-3">
        <InfoRow
          label="Locked"
          value={<StatusBadge active={accountLock.locked} activeLabel="Locked" inactiveLabel="Unlocked" />}
        />
        <InfoRow label="Failed Login Attempts" value={String(accountLock.failedAttempts)} />
        <InfoRow label="Last Failed Login" value={formatDateTime(accountLock.lastFailedLogin)} />
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <ActionButton label="Unlock Account" onClick={actions.unlockAccount} disabled={busy || !accountLock.locked} />
        <ActionButton label="Reset Failed Attempts" onClick={actions.resetFailedAttempts} disabled={busy} />
      </div>
    </section>
  );
}

export const AccountSecurityPanel = memo(function AccountSecurityPanel({ userId }: AccountSecurityPanelProps) {
  const snapshotQuery = useAccountSecuritySnapshot(userId);
  const actions = useAccountSecurityActions(userId);

  if (snapshotQuery.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-sm text-gray-400">
        Loading security settings…
      </div>
    );
  }

  if (snapshotQuery.isError || !snapshotQuery.data) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-sm text-red-400">
        {snapshotQuery.error?.message ?? 'Unable to load security settings'}
      </div>
    );
  }

  const snapshot = snapshotQuery.data;
  const hasTemporaryPassword = Boolean(actions.lastTemporaryPassword || snapshot.password.temporaryPasswordActive);

  return (
    <div className="flex-1 overflow-y-auto p-5 sm:px-6">
      <div className="space-y-5">
        <PasswordSection
          snapshot={snapshot}
          actions={actions}
          pendingAction={actions.pendingAction}
          hasTemporaryPassword={hasTemporaryPassword}
        />
        <EmailSection snapshot={snapshot} actions={actions} pendingAction={actions.pendingAction} />
        <InvitationsSection snapshot={snapshot} actions={actions} pendingAction={actions.pendingAction} />
        <SessionsSection snapshot={snapshot} actions={actions} pendingAction={actions.pendingAction} />
        <MfaSection snapshot={snapshot} actions={actions} pendingAction={actions.pendingAction} />
        <AccountLockSection snapshot={snapshot} actions={actions} pendingAction={actions.pendingAction} />
      </div>
    </div>
  );
});

export default AccountSecurityPanel;
