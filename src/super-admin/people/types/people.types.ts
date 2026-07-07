export type PeopleUserStatus = 'active' | 'suspended' | 'pending' | 'deleted';

export type PeopleVerificationStatus = 'verified' | 'pending' | 'unverified';

export type PeopleSortField = 'newest' | 'oldest' | 'name' | 'last_login' | 'role';

export type PeopleDrawerTab =
  | 'general'
  | 'roles'
  | 'permissions'
  | 'books'
  | 'orders'
  | 'subscriptions'
  | 'activity'
  | 'audit'
  | 'login-history'
  | 'security-events';

export type PeopleDrawerMode = 'view' | 'edit';

export interface PeopleUser {
  id: string;
  avatarUrl: string | null;
  name: string;
  email: string;
  phone: string | null;
  primaryRole: string;
  primaryRoleSlug: string;
  status: PeopleUserStatus;
  emailVerified: boolean;
  lastLogin: string | null;
  createdAt: string;
  country: string | null;
  timezone: string | null;
}

export interface PeopleStatistics {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  suspendedUsers: number;
  verifiedUsers: number;
  newUsers30Days: number;
}

export interface PeopleListResult {
  items: PeopleUser[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PeopleFilterOption {
  value: string;
  label: string;
}

export interface PeopleFilterOptions {
  roles: PeopleFilterOption[];
  statuses: PeopleFilterOption[];
  verification: PeopleFilterOption[];
  countries: PeopleFilterOption[];
}

export interface PeopleQueryParams {
  search?: string;
  role?: string;
  status?: string;
  verification?: string;
  country?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: PeopleSortField;
  page?: number;
  pageSize?: number;
}

export type PeopleRowAction = 'view' | 'edit' | 'suspend' | 'restore' | 'delete' | 'recover';

export interface PeopleServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PeopleRepositoryRow {
  id: string;
  email: string;
  full_name: string | null;
  avatar: string | null;
  status: string;
  phone: string | null;
  timezone: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_roles: PeopleRepositoryRoleRow[] | null;
}

export interface PeopleEditRepositoryRow extends PeopleRepositoryRow {
  preferred_language: string | null;
  avatar_storage_path: string | null;
  avatar_version: number | null;
}

export interface EditUserDetail {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phone: string | null;
  language: string;
  timezone: string | null;
  status: PeopleUserStatus;
  avatarUrl: string | null;
  avatarVersion: number | null;
  internalNotes: string;
  activeRoles: string[];
  primaryRoleSlug: string;
  primaryRole: string;
  createdAt: string;
  lastLogin: string | null;
  registrationMethod: string;
}

export interface PeopleRepositoryRoleRow {
  is_active: boolean;
  roles: { name: string; slug: string } | null;
}
