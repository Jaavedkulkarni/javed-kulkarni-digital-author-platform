const READER_RETURN_KEY = 'returnTo';
const ADMIN_RETURN_KEY = 'adminReturnTo';

const READER_AUTH_PREFIXES = [
  '/reader/sign-in',
  '/reader/sign-up',
  '/reader/forgot-password',
  '/reader/reset-password',
  '/reader/verify-email',
];

const ADMIN_AUTH_PREFIXES = ['/admin/login'];

function isSafeReturnPath(path: string): boolean {
  if (!path.startsWith('/')) return false;
  if (path.startsWith('//')) return false;
  return true;
}

function normalizePath(path: string): string {
  if (!path || path === '/') return '/';
  return path;
}

/** Skip storing return target when already on auth pages. */
export function shouldStoreReaderReturn(pathname: string): boolean {
  return !READER_AUTH_PREFIXES.some((p) => pathname.startsWith(p));
}

export function shouldStoreAdminReturn(pathname: string): boolean {
  if (!pathname.startsWith('/admin')) return false;
  return !ADMIN_AUTH_PREFIXES.some((p) => pathname.startsWith(p));
}

export function storeReaderReturnTo(path?: string): void {
  const target =
    path ??
    `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (!shouldStoreReaderReturn(window.location.pathname)) return;
  if (!isSafeReturnPath(target.split('?')[0])) return;
  sessionStorage.setItem(READER_RETURN_KEY, target);
}

export function storeAdminReturnTo(path?: string): void {
  const target =
    path ??
    `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (!shouldStoreAdminReturn(window.location.pathname)) return;
  if (!isSafeReturnPath(target.split('?')[0])) return;
  sessionStorage.setItem(ADMIN_RETURN_KEY, target);
}

export function peekReaderReturnTo(): string | null {
  return sessionStorage.getItem(READER_RETURN_KEY);
}

export function consumeReaderReturnTo(fallback = '/'): string {
  const stored = sessionStorage.getItem(READER_RETURN_KEY);
  sessionStorage.removeItem(READER_RETURN_KEY);
  if (stored && isSafeReturnPath(stored.split('?')[0])) {
    return normalizePath(stored);
  }
  return fallback;
}

export function consumeAdminReturnTo(fallback = '/admin'): string {
  const stored = sessionStorage.getItem(ADMIN_RETURN_KEY);
  sessionStorage.removeItem(ADMIN_RETURN_KEY);
  if (stored && isSafeReturnPath(stored.split('?')[0]) && stored.startsWith('/admin')) {
    return stored;
  }
  return fallback;
}

/** Protected reader member routes should return to themselves after login. */
export function storeReaderProtectedReturn(pathname: string, search = ''): void {
  const target = `${pathname}${search}`;
  if (!target.startsWith('/reader/')) return;
  if (READER_AUTH_PREFIXES.some((p) => pathname.startsWith(p))) return;
  sessionStorage.setItem(READER_RETURN_KEY, target);
}
