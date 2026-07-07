import { supabase } from './supabase';



export type AuthCallbackType = 'recovery' | 'signup' | 'magiclink' | null;



const AUTH_PARAM_KEYS = ['code', 'type', 'access_token', 'refresh_token', 'expires_in', 'token_type'] as const;



function parseHashParams(): URLSearchParams {

  const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;

  return new URLSearchParams(hash);

}



function parseSearchParams(search = window.location.search): URLSearchParams {

  return new URLSearchParams(search);

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

  if (pathname.includes('/reader/reset-password') || pathname.includes('/auth/reset-password')) return 'recovery';

  if (pathname.includes('/reader/verify-email') || pathname.includes('/auth/verify-email')) return 'signup';

  if (pathname.includes('/reader/sign-in') || pathname.includes('/auth/login')) return 'magiclink';

  return null;

}



/** True when the current URL still carries Supabase OAuth / magic-link callback params. */

export function hasAuthCallbackParams(

  pathname = window.location.pathname,

  search = window.location.search,

  hash = window.location.hash,

): boolean {

  const searchParams = parseSearchParams(search);

  if (searchParams.get('code')) return true;



  const hashParams = new URLSearchParams(

    hash.startsWith('#') ? hash.slice(1) : hash,

  );

  return Boolean(hashParams.get('access_token') && hashParams.get('refresh_token'));

}



/** Build a router-safe URL with auth callback params removed. */

export function buildCleanAuthUrl(

  pathname: string,

  search = '',

  hash = '',

): string {

  const params = parseSearchParams(search);

  AUTH_PARAM_KEYS.forEach((key) => params.delete(key));

  const nextSearch = params.toString();

  const nextHash = hash.startsWith('#') ? hash.slice(1) : hash;

  const hashParams = new URLSearchParams(nextHash);

  AUTH_PARAM_KEYS.forEach((key) => hashParams.delete(key));

  const cleanedHash = hashParams.toString();



  return `${pathname}${nextSearch ? `?${nextSearch}` : ''}${cleanedHash ? `#${cleanedHash}` : ''}`;

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

    return typeFromPath(pathname) ?? 'magiclink';

  }



  return null;

}



function stripAuthParamsFromUrl(): void {

  const url = new URL(window.location.href);

  url.hash = '';

  AUTH_PARAM_KEYS.forEach((key) => {

    url.searchParams.delete(key);

  });

  window.history.replaceState({}, document.title, `${url.pathname}${url.search}`);

}



/**
 * Confirm session after Supabase auto-handled callback (PKCE ?code= or hash tokens).
 * Returns callback type when a session was established.
 */

export async function processAuthCallback(): Promise<AuthCallbackType> {
  console.log('A0 processAuthCallback enter', { pathname: window.location.pathname, search: window.location.search });

  const callbackType = detectAuthCallbackType();
  console.log('A0b detectAuthCallbackType', { callbackType });

  if (!callbackType) {
    console.log('A0c processAuthCallback exit (no callback type)');
    return null;
  }

  const search = parseSearchParams();
  const code = search.get('code');
  console.log('A0d code param', { hasCode: Boolean(code) });

  if (code) {
    console.log('A1 before getSession (pkce code path)');
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log('A2 after getSession (pkce code path)', { hasSession: Boolean(session), error: error?.message });

    if (error || !session) {
      console.error('Auth callback: PKCE code in URL but no session after client init', error?.message);
      return null;
    }

    stripAuthParamsFromUrl();
    console.log('A2b stripAuthParamsFromUrl done (pkce code path)');

    return callbackType;
  }

  const hash = parseHashParams();
  const accessToken = hash.get('access_token');
  const refreshToken = hash.get('refresh_token');

  if (accessToken && refreshToken) {
    console.log('A3 before setSession (hash path)');
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    console.log('A4 after setSession (hash path)', { error: error?.message });

    if (error) {
      console.error('Auth callback setSession failed:', error.message);
      return null;
    }

    stripAuthParamsFromUrl();
    return callbackType;
  }

  console.log('A5 before getSession (fallback path)');
  const { data: { session } } = await supabase.auth.getSession();
  console.log('A6 after getSession (fallback path)', { hasSession: Boolean(session) });

  if (session) {
    stripAuthParamsFromUrl();
    return callbackType;
  }

  console.log('A7 processAuthCallback exit (no session)');
  return null;
}



/** Route recovery/verify callbacks to dedicated reader auth pages. */

export function authCallbackTargetPath(

  type: AuthCallbackType,

  pathname = window.location.pathname,

): string | null {

  switch (type) {

    case 'recovery':

      return pathname.startsWith('/auth/') ? '/auth/reset-password' : '/reader/reset-password';

    case 'signup':

      return pathname.startsWith('/auth/') ? '/auth/verify-email' : '/reader/verify-email';

    case 'magiclink':

      if (pathname === '/') return null;

      if (

        pathname.startsWith('/super') ||

        pathname.startsWith('/platform-admin') ||

        pathname.startsWith('/author') ||

        pathname.startsWith('/publisher') ||

        pathname.startsWith('/reader') ||

        pathname.startsWith('/admin')

      ) {

        return null;

      }

      return pathname.startsWith('/auth/') ? '/auth/login' : '/reader/sign-in';

    default:

      return null;

  }

}

