import {
  isAdmin,
  isAuthor,
  isReader,
  isSuperAdmin,
} from '../lib/permissions';
import type { SystemRole } from '../types/roles';
import { COMMON_NAVIGATION } from './common';
import { READER_NAVIGATION } from './reader';
import { AUTHOR_NAVIGATION } from './author';
import { PLATFORM_ADMIN_NAVIGATION } from './platform-admin';
import { SUPER_ADMIN_NAVIGATION } from './super-admin';
import { PUBLISHER_NAVIGATION } from './publisher';
import type {
  BuiltNavigation,
  NavigationBuildContext,
  NavigationGroup,
  NavigationItem,
  NavigationPermission,
  NavigationSection,
} from './types';

function cloneItem(item: NavigationItem): NavigationItem {
  return {
    ...item,
    children: item.children.map(cloneItem),
  };
}

function hasRequiredRole(item: NavigationItem, roles: SystemRole[]): boolean {
  if (item.requiredRoles.length === 0) return true;
  return item.requiredRoles.some((role) => roles.includes(role));
}

function hasRequiredPermission(
  item: NavigationItem,
  permissions: NavigationPermission[] | undefined,
): boolean {
  if (item.requiredPermissions.length === 0) return true;
  if (!permissions || permissions.length === 0) return true;
  return item.requiredPermissions.some((permission) => permissions.includes(permission));
}

function isItemAccessible(item: NavigationItem, ctx: NavigationBuildContext): boolean {
  if (!item.isVisible || !item.isEnabled) return false;
  if (!hasRequiredRole(item, ctx.roles)) return false;
  if (!hasRequiredPermission(item, ctx.permissions)) return false;
  return true;
}

function filterAccessibleItems(items: NavigationItem[], ctx: NavigationBuildContext): NavigationItem[] {
  const result: NavigationItem[] = [];

  for (const item of items) {
    if (!isItemAccessible(item, ctx)) continue;

    const children = filterAccessibleItems(item.children, ctx);
    result.push({ ...item, children });
  }

  return result;
}

function collectLeafPaths(item: NavigationItem): string[] {
  if (item.children.length === 0) {
    return item.path ? [item.path] : [];
  }
  return item.children.flatMap(collectLeafPaths);
}

function dedupeNavigationItems(items: NavigationItem[]): NavigationItem[] {
  const seenIds = new Set<string>();
  const seenPaths = new Set<string>();
  const result: NavigationItem[] = [];

  for (const item of items) {
    if (seenIds.has(item.id)) continue;

    if (item.children.length > 0) {
      const childPaths = collectLeafPaths(item);
      const isDuplicateGroup =
        childPaths.length > 0 && childPaths.every((path) => seenPaths.has(path));
      if (isDuplicateGroup) continue;

      childPaths.forEach((path) => seenPaths.add(path));
      seenIds.add(item.id);
      result.push(item);
      continue;
    }

    const pathKey = item.path || item.id;
    if (seenPaths.has(pathKey)) continue;

    seenPaths.add(pathKey);
    seenIds.add(item.id);
    result.push(item);
  }

  return result;
}

function sortNavigationItems(items: NavigationItem[]): NavigationItem[] {
  return [...items]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => ({
      ...item,
      children: sortNavigationItems(item.children),
    }));
}

function resolveActiveSections(roles: SystemRole[]): NavigationSection[] {
  const sections: NavigationSection[] = [];
  const hasPublisher = roles.includes('publisher');
  const hasNonPublisherRole =
    isReader(roles) || isAuthor(roles) || isAdmin(roles) || isSuperAdmin(roles);

  if (hasNonPublisherRole) {
    sections.push('common');
  }

  if (isReader(roles)) sections.push('reader');
  if (isAuthor(roles)) sections.push('author');
  if (isAdmin(roles) && !isSuperAdmin(roles)) sections.push('platform_admin');
  if (isSuperAdmin(roles)) sections.push('super_admin');
  if (hasPublisher) sections.push('publisher');

  return sections;
}

function groupNavigationItems(items: NavigationItem[]): NavigationGroup[] {
  const groups = new Map<NavigationSection, NavigationItem[]>();

  for (const item of items) {
    const bucket = groups.get(item.section) ?? [];
    bucket.push(item);
    groups.set(item.section, bucket);
  }

  return [...groups.entries()]
    .map(([section, sectionItems]) => ({
      id: `${section}-built-group`,
      title: section.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
      items: sectionItems,
      sortOrder: sectionItems[0]?.sortOrder ?? 0,
      isVisible: true,
      section,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Composes dynamic AuthorOS navigation from registry sources. */
export class NavigationBuilder {
  getCommonMenus(): NavigationItem[] {
    return COMMON_NAVIGATION.map(cloneItem);
  }

  getReaderMenus(): NavigationItem[] {
    return READER_NAVIGATION.map(cloneItem);
  }

  getAuthorMenus(): NavigationItem[] {
    return AUTHOR_NAVIGATION.map(cloneItem);
  }

  getPlatformAdminMenus(): NavigationItem[] {
    return PLATFORM_ADMIN_NAVIGATION.map(cloneItem);
  }

  getSuperAdminMenus(): NavigationItem[] {
    return SUPER_ADMIN_NAVIGATION.map(cloneItem);
  }

  getPublisherMenus(): NavigationItem[] {
    return PUBLISHER_NAVIGATION.map(cloneItem);
  }

  buildNavigation(ctx: NavigationBuildContext): NavigationItem[] {
    const sections = resolveActiveSections(ctx.roles);
    const merged: NavigationItem[] = [];

    if (sections.includes('common')) merged.push(...this.getCommonMenus());
    if (sections.includes('reader')) merged.push(...this.getReaderMenus());
    if (sections.includes('author')) merged.push(...this.getAuthorMenus());
    if (sections.includes('platform_admin')) merged.push(...this.getPlatformAdminMenus());
    if (sections.includes('super_admin')) merged.push(...this.getSuperAdminMenus());
    if (sections.includes('publisher')) merged.push(...this.getPublisherMenus());

    const accessible = filterAccessibleItems(merged, ctx);
    const deduped = dedupeNavigationItems(accessible);
    return sortNavigationItems(deduped);
  }

  buildNavigationGroups(ctx: NavigationBuildContext): NavigationGroup[] {
    const items = this.buildNavigation(ctx);
    return groupNavigationItems(items);
  }

  build(ctx: NavigationBuildContext): BuiltNavigation {
    const items = this.buildNavigation(ctx);
    return {
      items,
      groups: groupNavigationItems(items),
    };
  }
}

export const navigationBuilder = new NavigationBuilder();

export function getCommonMenus(): NavigationItem[] {
  return navigationBuilder.getCommonMenus();
}

export function getReaderMenus(): NavigationItem[] {
  return navigationBuilder.getReaderMenus();
}

export function getAuthorMenus(): NavigationItem[] {
  return navigationBuilder.getAuthorMenus();
}

export function getPlatformAdminMenus(): NavigationItem[] {
  return navigationBuilder.getPlatformAdminMenus();
}

export function getSuperAdminMenus(): NavigationItem[] {
  return navigationBuilder.getSuperAdminMenus();
}

export function getPublisherMenus(): NavigationItem[] {
  return navigationBuilder.getPublisherMenus();
}

export function buildNavigation(ctx: NavigationBuildContext): NavigationItem[] {
  return navigationBuilder.buildNavigation(ctx);
}

export function buildNavigationGroups(ctx: NavigationBuildContext): NavigationGroup[] {
  return navigationBuilder.buildNavigationGroups(ctx);
}

export function buildFullNavigation(ctx: NavigationBuildContext): BuiltNavigation {
  return navigationBuilder.build(ctx);
}

export {
  dedupeNavigationItems,
  filterAccessibleItems,
  isItemAccessible,
  resolveActiveSections,
  sortNavigationItems,
};
