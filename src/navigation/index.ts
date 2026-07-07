export type {
  NavigationBadge,
  NavigationBuildContext,
  NavigationGroup,
  NavigationItem,
  NavigationPermission,
  NavigationRegistry,
  NavigationRole,
  NavigationSection,
  BuiltNavigation,
} from './types';

export { defineNavigationGroup, defineNavigationItem } from './types';

export { COMMON_NAVIGATION } from './common';
export { READER_NAVIGATION } from './reader';
export { AUTHOR_NAVIGATION } from './author';
export { PLATFORM_ADMIN_NAVIGATION } from './platform-admin';
export { SUPER_ADMIN_NAVIGATION } from './super-admin';
export { PUBLISHER_NAVIGATION } from './publisher';

export {
  NAVIGATION_REGISTRY,
  NAVIGATION_REGISTRY_VERSION,
  getNavigationItemById,
  getNavigationItemsBySection,
} from './registry';

export {
  NavigationBuilder,
  navigationBuilder,
  buildNavigation,
  buildNavigationGroups,
  buildFullNavigation,
  getCommonMenus,
  getReaderMenus,
  getAuthorMenus,
  getPlatformAdminMenus,
  getSuperAdminMenus,
  getPublisherMenus,
  dedupeNavigationItems,
  filterAccessibleItems,
  isItemAccessible,
  resolveActiveSections,
  sortNavigationItems,
} from './builder';

export { useNavigation, useNavigationGroups, useNavigationItems } from './hooks';
