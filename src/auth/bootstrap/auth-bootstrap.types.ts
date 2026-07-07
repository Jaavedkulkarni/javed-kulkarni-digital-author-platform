import type { User } from '@supabase/supabase-js';
import type { BuiltNavigation } from '../../navigation/types';
import type { SystemRole, UserProfile } from '../../types/roles';

export type BootstrapErrorCode =
  | 'authentication_failed'
  | 'role_loading_failed'
  | 'permission_loading_failed'
  | 'navigation_loading_failed';

export interface AuthBootstrapError {
  code: BootstrapErrorCode;
  message: string;
}

export interface AuthBootstrapPayload {
  user: User;
  profile: UserProfile | null;
  assignedRoles: SystemRole[];
  effectiveRoles: SystemRole[];
  permissions: string[];
  navigation: BuiltNavigation;
}

export interface AuthBootstrapState {
  user: User | null;
  profile: UserProfile | null;
  assignedRoles: SystemRole[];
  effectiveRoles: SystemRole[];
  permissions: string[];
  navigation: BuiltNavigation | null;
  loading: boolean;
  isReady: boolean;
  error: AuthBootstrapError | null;
}

export const INITIAL_AUTH_BOOTSTRAP_STATE: AuthBootstrapState = {
  user: null,
  profile: null,
  assignedRoles: [],
  effectiveRoles: [],
  permissions: [],
  navigation: null,
  loading: true,
  isReady: false,
  error: null,
};

export function createBootstrapError(code: BootstrapErrorCode, message: string): AuthBootstrapError {
  return { code, message };
}
