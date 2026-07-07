import type { Session, User } from '@supabase/supabase-js';
import type { AuthSession, AuthTokens, AuthUser } from '../types/auth.types';
import { DEFAULT_AUTH_ROLE } from '../types/roles.types';

const REMEMBER_ME_KEY = 'authoros_auth_remember_me';

export function setRememberMePreference(rememberMe: boolean): void {
  if (typeof window === 'undefined') return;
  if (rememberMe) {
    window.localStorage.setItem(REMEMBER_ME_KEY, '1');
  } else {
    window.localStorage.removeItem(REMEMBER_ME_KEY);
  }
}

export function getRememberMePreference(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(REMEMBER_ME_KEY) === '1';
}

/** Map Supabase user to AuthUser. Role is a placeholder — real roles come from AuthBootstrap. */
export function mapSupabaseUserToAuthUser(user: User): AuthUser {
  const metadata = user.user_metadata ?? {};
  const fullName =
    (typeof metadata.full_name === 'string' && metadata.full_name) ||
    (typeof metadata.name === 'string' && metadata.name) ||
    user.email?.split('@')[0] ||
    '';

  return {
    id: user.id,
    email: user.email ?? '',
    role: DEFAULT_AUTH_ROLE,
    fullName,
    emailVerified: Boolean(user.email_confirmed_at),
    createdAt: user.created_at,
  };
}

export function mapSupabaseTokens(session: Session): AuthTokens {
  const accessExpiresAt = session.expires_at ? session.expires_at * 1000 : Date.now() + 3_600_000;

  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    accessTokenExpiresAt: accessExpiresAt,
    refreshTokenExpiresAt: accessExpiresAt + 30 * 24 * 60 * 60 * 1000,
  };
}

export function mapSupabaseSessionToAuthSession(
  session: Session,
  rememberMe = getRememberMePreference(),
): AuthSession {
  return {
    user: mapSupabaseUserToAuthUser(session.user),
    tokens: mapSupabaseTokens(session),
    rememberMe,
    lastRefreshedAt: Date.now(),
  };
}
