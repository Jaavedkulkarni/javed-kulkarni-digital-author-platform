export const TIMELINE_PAGE_SIZE = 25;

export const TIMELINE_SEVERITY_OPTIONS = [
  { value: '', label: 'All severities' },
  { value: 'normal', label: 'Normal' },
  { value: 'warning', label: 'Warning' },
  { value: 'critical', label: 'Critical' },
] as const;

export const LOGIN_EVENT_TYPE_OPTIONS = [
  { value: '', label: 'All events' },
  { value: 'login', label: 'Login' },
  { value: 'logout', label: 'Logout' },
  { value: 'failed_login', label: 'Failed Login' },
  { value: 'password_change', label: 'Password Change' },
  { value: 'session_created', label: 'Session Created' },
  { value: 'session_revoked', label: 'Session Revoked' },
  { value: 'mfa_enabled', label: 'MFA Enabled' },
  { value: 'mfa_disabled', label: 'MFA Disabled' },
] as const;

export const SECURITY_EVENT_TYPE_OPTIONS = [
  { value: '', label: 'All events' },
  { value: 'password_reset', label: 'Password Reset' },
  { value: 'password_expired', label: 'Password Expired' },
  { value: 'temporary_password_generated', label: 'Temporary Password Generated' },
  { value: 'temporary_password_used', label: 'Temporary Password Used' },
  { value: 'email_verified', label: 'Email Verified' },
  { value: 'verification_revoked', label: 'Verification Revoked' },
  { value: 'invite_sent', label: 'Invite Sent' },
  { value: 'invite_accepted', label: 'Invite Accepted' },
  { value: 'invite_cancelled', label: 'Invite Cancelled' },
  { value: 'account_locked', label: 'Account Locked' },
  { value: 'account_unlocked', label: 'Account Unlocked' },
  { value: 'failed_login_threshold', label: 'Failed Login Threshold' },
  { value: 'protected_account_action', label: 'Protected Account Action' },
  { value: 'role_escalation', label: 'Role Escalation' },
  { value: 'bulk_security_action', label: 'Bulk Security Action' },
] as const;

export const AUDIT_ACTION_OPTIONS = [
  { value: '', label: 'All actions' },
  { value: 'create', label: 'Create' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
  { value: 'suspend', label: 'Suspend' },
  { value: 'restore', label: 'Restore' },
  { value: 'password_reset', label: 'Password Reset' },
  { value: 'bulk_operation', label: 'Bulk Operation' },
] as const;

export const TIMELINE_EXPORT_FORMATS = [
  { value: 'csv', label: 'CSV' },
  { value: 'xlsx', label: 'Excel' },
  { value: 'pdf', label: 'PDF' },
  { value: 'json', label: 'JSON' },
] as const;

export const TIMELINE_INPUT_CLASS =
  'w-full min-h-9 rounded-lg border border-navy-600 bg-navy-900/60 px-3 text-sm text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50';

export const TIMELINE_LABEL_CLASS = 'mb-1 block text-xs font-medium text-gray-500';
