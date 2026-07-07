export const ACCOUNT_SECURITY_INPUT_CLASS =
  'inline-flex min-h-9 items-center rounded-lg border border-navy-600 bg-navy-900/60 px-3 text-xs font-medium text-gray-200 transition-colors hover:bg-navy-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50';

export const ACCOUNT_SECURITY_SECTION_CLASS =
  'space-y-4 rounded-xl border border-navy-700 bg-navy-800/30 p-4';

export const ACCOUNT_SECURITY_LABEL_CLASS = 'text-xs font-medium uppercase tracking-wide text-gray-500';

export const EDIT_USER_DRAWER_TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'security', label: 'Security' },
] as const;

export type EditUserDrawerTab = (typeof EDIT_USER_DRAWER_TABS)[number]['id'];

export const DEFAULT_INVITE_ROLE = 'reader';
