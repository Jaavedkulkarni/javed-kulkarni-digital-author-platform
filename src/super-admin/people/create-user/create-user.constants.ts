import type { CreateUserFormValues, CreateUserStatus } from './create-user.types';

export const CREATE_USER_DRAWER_TITLE = 'Create User';

export const CREATE_USER_DRAWER_SUBTITLE = 'Create a new platform account.';

export const CREATE_USER_DRAWER_MAX_WIDTH = 'max-w-3xl';

export const CREATE_USER_DRAWER_Z_INDEX = 'z-[130]';

export const CREATE_USER_TRANSITION_MS = 300;

export const CREATE_USER_STATUS_OPTIONS: { value: CreateUserStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending Verification' },
  { value: 'suspended', label: 'Suspended' },
];

export const CREATE_USER_LANGUAGE_OPTIONS = [
  { value: 'mr', label: 'Marathi (मराठी)' },
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi (हिंदी)' },
] as const;

export const CREATE_USER_TIMEZONE_OPTIONS = [
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
  { value: 'Asia/Calcutta', label: 'Asia/Calcutta (IST)' },
  { value: 'America/New_York', label: 'America/New_York (EST)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST)' },
  { value: 'Europe/London', label: 'Europe/London (GMT)' },
  { value: 'America/Toronto', label: 'America/Toronto (EST)' },
] as const;

export const CREATE_USER_UNSAVED_MESSAGE =
  'You have unsaved changes. Discard them and close the drawer?';

export const CREATE_USER_FORM_ID = 'create-user-form';

export const CREATE_USER_DEFAULT_VALUES: CreateUserFormValues = {
  firstName: '',
  lastName: '',
  displayName: '',
  email: '',
  phone: '',
  profilePhoto: null,
  role: '',
  status: 'active',
  emailVerificationRequired: true,
  password: '',
  language: 'mr',
  timezone: 'Asia/Kolkata',
  internalNotes: '',
};

export const CREATE_USER_INPUT_CLASS =
  'w-full min-h-10 rounded-lg border border-navy-600 bg-navy-900/60 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50';

export const CREATE_USER_LABEL_CLASS = 'mb-1.5 block text-xs font-medium text-gray-400';

export const CREATE_USER_SECTION_CLASS = 'space-y-4 rounded-xl border border-navy-700 bg-navy-800/30 p-4';

export const CREATE_USER_ERROR_CLASS = 'mt-1 text-xs text-red-400';

export const PASSWORD_MIN_LENGTH = 12;

export const PASSWORD_SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
