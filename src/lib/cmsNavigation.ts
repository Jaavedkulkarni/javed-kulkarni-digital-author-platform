const CMS_LAST_PAGE_KEY = 'cmsLastPage';

function isSafeReturnPath(path: string): boolean {
  if (!path.startsWith('/')) return false;
  if (path.startsWith('//')) return false;
  if (path.startsWith('/admin/login')) return false;
  return path.startsWith('/admin') || path.startsWith('/super') || path.startsWith('/author');
}

export function trackCmsPage(path?: string): void {
  const target = path ?? `${window.location.pathname}${window.location.search}`;
  if (!isSafeReturnPath(target.split('?')[0])) return;
  sessionStorage.setItem(CMS_LAST_PAGE_KEY, target);
}

export function peekCmsPage(): string | null {
  return sessionStorage.getItem(CMS_LAST_PAGE_KEY);
}

export function consumeCmsPage(fallback = '/admin'): string {
  const stored = sessionStorage.getItem(CMS_LAST_PAGE_KEY);
  if (stored && isSafeReturnPath(stored.split('?')[0])) {
    return stored;
  }
  return fallback;
}
