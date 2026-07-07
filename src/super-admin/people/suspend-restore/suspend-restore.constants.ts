export const SUSPEND_REASON_OPTIONS = [
  { value: 'policy_violation', label: 'Policy Violation' },
  { value: 'spam', label: 'Spam' },
  { value: 'security', label: 'Security' },
  { value: 'requested_by_user', label: 'Requested by User' },
  { value: 'duplicate_account', label: 'Duplicate Account' },
  { value: 'other', label: 'Other' },
] as const;

export const SUSPEND_DIALOG_MESSAGE =
  'Suspended users cannot sign in or access the platform until their account is restored by a Super Admin.';

export const RESTORE_DIALOG_MESSAGE =
  'Restoring this user will re-enable platform access with an active account status.';

export const SUSPEND_USER_INPUT_CLASS =
  'w-full min-h-10 rounded-lg border border-navy-600 bg-navy-900/60 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50';

export const SUSPEND_USER_LABEL_CLASS = 'mb-1.5 block text-xs font-medium text-gray-400';

export const SUSPEND_USER_ERROR_CLASS = 'mt-1 text-xs text-red-400';
