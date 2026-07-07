import { COMMON_NAVIGATION } from './common';
import { READER_NAVIGATION } from './reader';
import { AUTHOR_NAVIGATION } from './author';
import { PLATFORM_ADMIN_NAVIGATION } from './platform-admin';
import { SUPER_ADMIN_NAVIGATION } from './super-admin';
import { PUBLISHER_NAVIGATION } from './publisher';
import { defineNavigationGroup } from './types';
import type { NavigationItem, NavigationRegistry, NavigationSection } from './types';

export const NAVIGATION_REGISTRY_VERSION = '1.0.0';

function flattenItems(items: NavigationItem[]): NavigationItem[] {
  const result: NavigationItem[] = [];
  for (const item of items) {
    result.push(item);
    if (item.children.length > 0) {
      result.push(...flattenItems(item.children));
    }
  }
  return result;
}

function sectionGroup(
  section: NavigationSection,
  title: string,
  items: NavigationItem[],
  sortOrder: number,
) {
  return defineNavigationGroup({
    id: `${section}-group`,
    title,
    items,
    sortOrder,
    section,
  });
}

/** Authoritative navigation registry for all AuthorOS surfaces. */
export const NAVIGATION_REGISTRY: NavigationRegistry = {
  version: NAVIGATION_REGISTRY_VERSION,
  sections: {
    common: [sectionGroup('common', 'Common', COMMON_NAVIGATION, 0)],
    reader: [sectionGroup('reader', 'Reader', READER_NAVIGATION, 100)],
    author: [sectionGroup('author', 'Author', AUTHOR_NAVIGATION, 200)],
    platform_admin: [
      sectionGroup('platform_admin', 'Platform Admin', PLATFORM_ADMIN_NAVIGATION, 300),
    ],
    super_admin: [sectionGroup('super_admin', 'Super Admin', SUPER_ADMIN_NAVIGATION, 400)],
    publisher: [sectionGroup('publisher', 'Publisher', PUBLISHER_NAVIGATION, 600)],
  },
  items: flattenItems([
    ...COMMON_NAVIGATION,
    ...READER_NAVIGATION,
    ...AUTHOR_NAVIGATION,
    ...PLATFORM_ADMIN_NAVIGATION,
    ...SUPER_ADMIN_NAVIGATION,
    ...PUBLISHER_NAVIGATION,
  ]),
};

/** Lookup a registry entry by stable identifier. */
export function getNavigationItemById(id: string): NavigationItem | undefined {
  return NAVIGATION_REGISTRY.items.find((item) => item.id === id);
}

/** Lookup all entries belonging to a logical section. */
export function getNavigationItemsBySection(section: NavigationSection): NavigationItem[] {
  return NAVIGATION_REGISTRY.sections[section].flatMap((group) => group.items);
}
