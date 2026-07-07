import type { SystemRole } from '../../../types/roles';

export type UserStatus = 'active' | 'suspended' | 'blocked' | 'pending';
export type MembershipTier = 'free' | 'basic' | 'premium' | 'lifetime';
export type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'unverified';

export interface AllUsersRecord {
  id: string;
  avatarUrl: string | null;
  name: string;
  username: string;
  email: string;
  phone: string;
  roles: SystemRole[];
  status: UserStatus;
  membership: MembershipTier;
  verification: VerificationStatus;
  books: number;
  blogs: number;
  articles: number;
  stories: number;
  poems: number;
  orders: number;
  walletBalance: number;
  country: string;
  state: string;
  city: string;
  lastLogin: string;
  createdAt: string;
  isNewToday: boolean;
  isActiveToday: boolean;
}

export interface AllUsersStats {
  totalUsers: number;
  readers: number;
  authors: number;
  publishers: number;
  platformAdmins: number;
  superAdmins: number;
  newToday: number;
  activeToday: number;
}

export type AllUsersUiPreviewState = 'ready' | 'loading' | 'error' | 'empty';

export type AllUsersColumnKey =
  | 'select'
  | 'avatar'
  | 'userId'
  | 'name'
  | 'username'
  | 'email'
  | 'phone'
  | 'roles'
  | 'status'
  | 'membership'
  | 'verification'
  | 'books'
  | 'blogs'
  | 'articles'
  | 'stories'
  | 'poems'
  | 'orders'
  | 'wallet'
  | 'lastLogin'
  | 'createdAt'
  | 'actions';

export interface SavedFilterPreset {
  id: string;
  label: string;
}

export interface AdvancedSearchGroup {
  id: string;
  operator: 'AND' | 'OR';
  field: string;
  value: string;
}
