import type { SiteNavItem } from './siteNavigation';

/** Flatten grouped nav items for compact menus (e.g. public dropdown). */
export function flattenNavItems(items: SiteNavItem[], parentLabel?: string): SiteNavItem[] {
  const result: SiteNavItem[] = [];

  for (const item of items) {
    if (item.action === 'logout') {
      result.push(item);
      continue;
    }

    if (item.children?.length) {
      result.push(...flattenNavItems(item.children, item.label));
      continue;
    }

    if (item.path) {
      result.push({
        ...item,
        label: parentLabel ? `${parentLabel} · ${item.label}` : item.label,
      });
    }
  }

  return result;
}

export function isNavPathActive(pathname: string, path: string): boolean {
  if (path === '/reader') {
    return pathname === '/reader' || pathname === '/reader/dashboard';
  }
  if (path === '/author') {
    return pathname === '/author';
  }
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function findActiveNavItem(items: SiteNavItem[], pathname: string): SiteNavItem | undefined {
  for (const item of items) {
    if (item.children?.length) {
      const childMatch = findActiveNavItem(item.children, pathname);
      if (childMatch) return childMatch;
    } else if (item.path && isNavPathActive(pathname, item.path)) {
      return item;
    }
  }
  return undefined;
}
