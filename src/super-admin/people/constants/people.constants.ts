import type { PeopleSortField } from '../types/people.types';

export const PEOPLE_PAGE_TITLE = 'People';

export const PEOPLE_PAGE_SUBTITLE =
  'Manage all platform users, roles, accounts and access.';

export const PEOPLE_BREADCRUMB = {
  root: 'Super Admin',
  current: 'People',
} as const;

export const PEOPLE_PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

export const PEOPLE_DEFAULT_PAGE_SIZE = 10;

export const PEOPLE_DEFAULT_SORT: PeopleSortField = 'newest';

export const PEOPLE_PROFILE_SELECT = `
  id,
  email,
  full_name,
  avatar,
  status,
  phone,
  timezone,
  created_at,
  updated_at,
  deleted_at,
  user_roles (
    is_active,
    roles (
      name,
      slug
    )
  )
`;

export const PEOPLE_EDIT_PROFILE_SELECT = `
  id,
  email,
  full_name,
  avatar,
  avatar_storage_path,
  avatar_version,
  status,
  phone,
  timezone,
  preferred_language,
  created_at,
  updated_at,
  deleted_at,
  user_roles (
    is_active,
    roles (
      name,
      slug
    )
  )
`;

export const TIMEZONE_COUNTRY_MAP: Record<string, string> = {
  'Asia/Kolkata': 'India',
  'Asia/Calcutta': 'India',
  'America/New_York': 'United States',
  'America/Los_Angeles': 'United States',
  'America/Chicago': 'United States',
  'Europe/London': 'United Kingdom',
  'America/Toronto': 'Canada',
};

export const COUNTRY_TIMEZONE_PREFIXES: Record<string, string[]> = {
  India: ['Asia/Kolkata', 'Asia/Calcutta'],
  'United States': ['America/'],
  'United Kingdom': ['Europe/London'],
  Canada: ['America/Toronto'],
};

export const PEOPLE_STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'pending', label: 'Pending' },
  { value: 'deleted', label: 'Deleted' },
] as const;

export const PEOPLE_VERIFICATION_FILTER_OPTIONS = [
  { value: '', label: 'All verification' },
  { value: 'verified', label: 'Verified' },
  { value: 'pending', label: 'Pending' },
  { value: 'unverified', label: 'Unverified' },
] as const;

export const PEOPLE_SORT_OPTIONS: { value: PeopleSortField; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'name', label: 'Name' },
  { value: 'last_login', label: 'Last Login' },
  { value: 'role', label: 'Role' },
];

export const PEOPLE_DRAWER_TABS = [
  { id: 'general', label: 'General' },
  { id: 'roles', label: 'Roles' },
  { id: 'permissions', label: 'Permissions' },
  { id: 'books', label: 'Books' },
  { id: 'orders', label: 'Orders' },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'activity', label: 'Activity' },
  { id: 'audit', label: 'Audit' },
  { id: 'login-history', label: 'Login History' },
  { id: 'security-events', label: 'Security Events' },
] as const;

export const PEOPLE_ROW_ACTIONS = [
  { id: 'view', label: 'View' },
  { id: 'edit', label: 'Edit' },
  { id: 'suspend', label: 'Suspend' },
  { id: 'delete', label: 'Delete' },
] as const;

export const PEOPLE_QUERY_STALE_TIME_MS = 60_000;

export const PEOPLE_STATS_STALE_TIME_MS = 60_000;

export const PEOPLE_FILTERS_STALE_TIME_MS = 5 * 60_000;
