import type { NavigationGroup, NavigationItem } from '../../../navigation/types';
import { isNavPathActive } from '../../../lib/navRendering';

const COLLAPSED_STORAGE_KEY = 'authoros-sidebar-collapsed';
const EXPANDED_GROUPS_STORAGE_KEY = 'authoros-sidebar-expanded-groups';

export function readSidebarCollapsed(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(COLLAPSED_STORAGE_KEY) === 'true';
}

export function writeSidebarCollapsed(collapsed: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COLLAPSED_STORAGE_KEY, String(collapsed));
}

export function readExpandedGroups(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(EXPANDED_GROUPS_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(parsed);
  } catch {
    return new Set();
  }
}

export function writeExpandedGroups(groups: Set<string>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(EXPANDED_GROUPS_STORAGE_KEY, JSON.stringify([...groups]));
}

export function isNavigationItemActive(pathname: string, item: NavigationItem): boolean {
  if (!item.path || item.action) return false;
  return isNavPathActive(pathname, item.path);
}

export function itemHasActiveDescendant(pathname: string, item: NavigationItem): boolean {
  if (isNavigationItemActive(pathname, item)) return true;
  return item.children.some((child) => itemHasActiveDescendant(pathname, child));
}

export function collectActiveGroupIds(items: NavigationItem[], pathname: string): string[] {
  const ids: string[] = [];

  const walk = (nodes: NavigationItem[]) => {
    for (const node of nodes) {
      if (node.children.length > 0) {
        if (itemHasActiveDescendant(pathname, node)) {
          ids.push(node.id);
        }
        walk(node.children);
      }
    }
  };

  walk(items);
  return ids;
}

export function flattenNavigationItems(items: NavigationItem[]): NavigationItem[] {
  const result: NavigationItem[] = [];

  const walk = (nodes: NavigationItem[]) => {
    for (const node of nodes) {
      if (node.action === 'search' || node.action === 'logout') continue;
      if (node.children.length > 0) {
        walk(node.children);
      } else if (node.path) {
        result.push(node);
      }
    }
  };

  walk(items);
  return result;
}

export function filterNavigationItems(items: NavigationItem[], query: string): NavigationItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;

  const filterNode = (node: NavigationItem): NavigationItem | null => {
    if (node.action === 'search' || node.action === 'logout') return null;

    const titleMatch = node.title.toLowerCase().includes(normalized);
    const pathMatch = node.path.toLowerCase().includes(normalized);
    const filteredChildren = node.children
      .map(filterNode)
      .filter((child): child is NavigationItem => child !== null);

    if (titleMatch || pathMatch || filteredChildren.length > 0) {
      return { ...node, children: filteredChildren };
    }

    return null;
  };

  return items
    .map(filterNode)
    .filter((item): item is NavigationItem => item !== null);
}

export function filterNavigationGroups(
  groups: { id: string; title: string; items: NavigationItem[] }[],
  query: string,
) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return groups;

  return groups
    .map((group) => ({
      ...group,
      items: filterNavigationItems(group.items, normalized),
    }))
    .filter((group) => group.items.length > 0);
}

import type { NavigationGroup, NavigationItem } from '../../../navigation/types';

export function findFooterItems(items: NavigationItem[]): NavigationItem[] {
  const footerIds = new Set(['common-account', 'common-help', 'publisher-account', 'publisher-help']);
  return flattenNavigationItems(items).filter(
    (item) => footerIds.has(item.id) || item.path.endsWith('/settings') || item.path.endsWith('/help'),
  );
}

const MAIN_NAV_EXCLUDED_IDS = new Set([
  'common-account',
  'common-help',
  'common-profile',
  'publisher-profile',
  'publisher-account',
  'publisher-help',
]);

function excludeFromMainNav(items: NavigationItem[]): NavigationItem[] {
  return items
    .filter((item) => !MAIN_NAV_EXCLUDED_IDS.has(item.id))
    .map((item) => ({
      ...item,
      children: excludeFromMainNav(item.children),
    }))
    .filter((item) => item.path || item.children.length > 0);
}

export function prepareMainNavigationGroups(groups: NavigationGroup[]): NavigationGroup[] {
  return groups
    .map((group) => ({
      ...group,
      items: excludeFromMainNav(group.items),
    }))
    .filter((group) => group.items.length > 0);
}

export function findProfileItem(items: NavigationItem[]): NavigationItem | undefined {
  return flattenNavigationItems(items).find(
    (item) =>
      item.id === 'common-profile' ||
      item.id === 'publisher-profile' ||
      item.path.endsWith('/profile'),
  );
}

export function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  const source = name?.trim() || email?.trim() || 'U';
  return source
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
