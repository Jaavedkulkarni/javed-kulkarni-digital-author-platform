export const DELETE_REASON_OPTIONS = [
  { value: 'duplicate_account', label: 'Duplicate Account' },
  { value: 'requested_by_user', label: 'Requested by User' },
  { value: 'spam', label: 'Spam' },
  { value: 'legal_request', label: 'Legal Request' },
  { value: 'security', label: 'Security' },
  { value: 'other', label: 'Other' },
] as const;

export const DELETE_DIALOG_MESSAGE =
  'This is a recoverable soft delete. The user will immediately lose platform access, but their profile, roles, avatar, and history can be restored later.';

export const RECOVER_DIALOG_MESSAGE =
  'Recovering this user will clear the soft delete and restore their previous account status, roles, and profile data.';

export const DELETE_USER_INPUT_CLASS =
  'w-full min-h-10 rounded-lg border border-navy-600 bg-navy-900/60 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50';

export const DELETE_USER_LABEL_CLASS = 'mb-1.5 block text-xs font-medium text-gray-400';

export const DELETE_USER_ERROR_CLASS = 'mt-1 text-xs text-red-400';
