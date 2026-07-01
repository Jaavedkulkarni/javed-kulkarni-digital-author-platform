export interface ReaderProfile {
  id: string;
  full_name: string | null;
  display_name: string | null;
  mobile: string | null;
  avatar: string | null;
  language: string;
  membership_status: string;
  joined_at: string;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export type ReaderView =
  | 'dashboard'
  | 'library'
  | 'wishlist'
  | 'profile'
  | 'history'
  | 'settings';

export interface ReaderSignupData {
  email: string;
  password: string;
  full_name: string;
  display_name?: string;
}
