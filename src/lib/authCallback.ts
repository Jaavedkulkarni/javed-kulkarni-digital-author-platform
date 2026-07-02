import { supabase } from './supabase';

export type AuthCallbackType = 'recovery' | 'signup' | 'magiclink' | null;

function parseHashParams(): URLSearchParams {
  const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
  return new URLSearchParams(hash);
}

function parseSearchParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

function typeFromParams(hash: URLSearchParams, search: URLSearchParams): AuthCallbackType {
  const hashType = hash.get('type');
  if (hashType === 'recovery') return 'recovery';
  if (hashType === 'signup' || hashType === 'email') return 'signup';
  if (hashType === 'magiclink') return 'magiclink';

  const searchType = search.get('type');
  if (searchType === 'recovery') return 'recovery';
  if (searchType === 'signup' || searchType === 'email') return 'signup';
  if (searchType === 'magiclink') return 'magiclink';

  return null;
}

function typeFromPath(pathname: string): AuthCallbackType | null {
  if (pathname.includes('/reader/reset-password')) return 'recovery';
  if (pathname.includes('/reader/verify-email')) return 'signup';
  if (pathname.includes('/reader/sign-in')) return 'magiclink';
  return null;
}

/** Detect Supabase auth tokens in the current URL (hash or PKCE code). */
export function detectAuthCallbackType(pathname = window.location.pathname): AuthCallbackType {
  const hash = parseHashParams();
  const search = parseSearchParams();

  const explicitType = typeFromParams(hash, search);
  if (explicitType) return explicitType;

  const hasCode = !!search.get('code');
  const hasTokens = !!(hash.get('access_token') && hash.get('refresh_token'));

  if (hasCode || hasTokens) {
    return typeFromPath(pathname) ?? null;
  }

  return null;
}

function stripAuthParamsFromUrl(): void {
  const url = new URL(window.location.href);
  url.hash = '';
  ['code', 'type', 'access_token', 'refresh_token', 'expires_in', 'token_type'].forEach((key) => {
    url.searchParams.delete(key);
  });
  window.history.replaceState({}, document.title, `${url.pathname}${url.search}`);
}

/**
 * Exchange PKCE code or implicit hash tokens for a Supabase session.
 * Returns callback type when a session was established.
 */
export async function processAuthCallback(): Promise<AuthCallbackType> {
  const callbackType = detectAuthCallbackType();
  if (!callbackType) return null;

  const search = parseSearchParams();
  const code = search.get('code');

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('Auth callback exchange failed:', error.message);
      return null;
    }
    stripAuthParamsFromUrl();
    return callbackType;
  }

  const hash = parseHashParams();
  const accessToken = hash.get('access_token');
  const refreshToken = hash.get('refresh_token');

  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) {
      console.error('Auth callback setSession failed:', error.message);
      return null;
    }
    stripAuthParamsFromUrl();
    return callbackType;
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    stripAuthParamsFromUrl();
    return callbackType;
  }

  return null;
}

/** Route recovery/verify callbacks to dedicated reader auth pages. */
export function authCallbackTargetPath(type: AuthCallbackType): string | null {
  switch (type) {
    case 'recovery':
      return '/reader/reset-password';
    case 'signup':
      return '/reader/verify-email';
    case 'magiclink':
      return '/reader/sign-in';
    default:
      return null;
  }
}
