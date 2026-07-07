import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  Crown,
  FileText,
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Shield,
  ShoppingBag,
  Truck,
  User,
} from 'lucide-react';
import type { AuthRole } from '../auth/types/roles.types';
import type { SystemRole } from '../types/roles';
import type { UserRoleAssignment } from '../organization/types/role.types';
import { buildPlatformAdminMenu } from '../platform-admin/components/layout/platformAdminNav';
import { PLATFORM_ADMIN_NAV } from '../platform-admin/utils/navigation';
import { AUTHOR_SHELL_MENU } from './authorPaths';
import type { SiteNavItem } from './siteNavigation';
import {
  isAdmin,
  isAuthor,
  isReader,
  isSuperAdmin,
} from './permissions';

/** Business roles used for navigation — not workspace switching. */
export type NavigationSurface = 'reader' | 'author' | 'platform_admin' | 'super_admin' | 'publisher';

export interface NavigationContext {
  systemRoles: SystemRole[];
  assignments?: UserRoleAssignment[];
  authRoles?: AuthRole[];
}

/**
 * AuthorOS role model — one identity, multiple independent role bundles.
 * Publisher does NOT inherit Reader; Reader nav appears only with Reader role.
 */
export const ROLE_MODEL = {
  reader: ['reader'],
  author: ['reader', 'author'],
  admin: ['reader', 'admin'],
  super_admin: ['reader', 'super_admin'],
  publisher: ['publisher'],
} as const;

export const CONTENT_CREATION_MATRIX: Record<NavigationSurface, boolean> = {
  reader: false,
  author: true,
  platform_admin: true,
  super_admin: true,
  publisher: false,
};

export const NAVIGATION_MATRIX: Record<NavigationSurface, readonly string[]> = {
  reader: ['Home', 'Books', 'Library', 'Orders', 'Profile'],
  author: ['Author Dashboard', 'Content', 'Drafts', 'Analytics'],
  platform_admin: [
    'Dashboard',
    'Content Review',
    'Paperback',
    'Finance',
    'Support',
    'Marketing',
    'Author Services',
    'Legal',
  ],
  super_admin: ['Super Admin', 'Platform', 'Security', 'Analytics'],
  publisher: ['Publisher Dashboard', 'RFQ', 'Production', 'Dispatch', 'Job Tracking'],
};

/** Approved AuthorOS capability matrix (navigation layer). */
export const CAPABILITY_MATRIX = {
  reader: {
    browse: true,
    purchase: true,
    library: true,
    contentCreation: false,
    review: false,
    platformOperations: false,
    fullPlatformControl: false,
    printingWorkflow: false,
  },
  author: {
    browse: true,
    purchase: true,
    library: true,
    contentCreation: true,
    review: false,
    platformOperations: false,
    fullPlatformControl: false,
    printingWorkflow: false,
  },
  platform_admin: {
    browse: true,
    purchase: true,
    library: true,
    contentCreation: true,
    review: true,
    platformOperations: true,
    fullPlatformControl: false,
    printingWorkflow: false,
  },
  super_admin: {
    browse: true,
    purchase: true,
    library: true,
    contentCreation: true,
    review: true,
    platformOperations: true,
    fullPlatformControl: true,
    printingWorkflow: false,
  },
  publisher: {
    browse: false,
    purchase: false,
    library: false,
    contentCreation: false,
    review: false,
    platformOperations: false,
    fullPlatformControl: false,
    printingWorkflow: true,
  },
} as const;

const READER_NAV: SiteNavItem[] = [
  { id: 'home', label: 'Home', path: '/', icon: Home },
  { id: 'books', label: 'Books', path: '/#books', icon: BookOpen },
  { id: 'library', label: 'Library', path: '/reader/library', icon: BookOpen },
  { id: 'bookmarks', label: 'Bookmarks', path: '/reader/wishlist', icon: Heart },
  { id: 'orders', label: 'Orders', path: '/reader/orders', icon: ShoppingBag },
  { id: 'membership', label: 'Membership', path: '/reader/membership', icon: Crown },
  { id: 'profile', label: 'Profile', path: '/reader/profile', icon: User },
];

const PLATFORM_ADMIN_NAV_ITEMS: SiteNavItem[] = buildPlatformAdminMenu(PLATFORM_ADMIN_NAV).map((item) => ({
  id: item.id,
  label: item.label,
  path: item.path,
  icon: item.icon,
}));

const SUPER_ADMIN_NAV: SiteNavItem[] = [
  { id: 'super-admin', label: 'Super Admin', path: '/super', icon: Shield },
  { id: 'sa-platform', label: 'Platform', path: '/super/platform', icon: Settings },
  { id: 'sa-security', label: 'Security', path: '/super/security', icon: Shield },
  { id: 'sa-analytics', label: 'Analytics', path: '/super/analytics', icon: BarChart3 },
];

const PUBLISHER_NAV: SiteNavItem[] = [
  { id: 'publisher-dashboard', label: 'Publisher Dashboard', path: '/publisher', icon: LayoutDashboard },
  { id: 'publisher-rfq', label: 'RFQ', path: '/publisher/rfq', icon: ClipboardList },
  { id: 'publisher-production', label: 'Production', path: '/publisher/production', icon: Package },
  { id: 'publisher-dispatch', label: 'Dispatch', path: '/publisher/dispatch', icon: Truck },
  { id: 'publisher-jobs', label: 'Job Tracking', path: '/publisher/jobs', icon: ClipboardList },
];

const LOGOUT_ITEM: SiteNavItem = { id: 'logout', label: 'Logout', icon: LogOut, action: 'logout' };

export function hasPublisherNavigationRole(ctx: NavigationContext): boolean {
  if (ctx.authRoles?.includes('publisher')) return true;
  return (ctx.assignments ?? []).some((assignment) => assignment.roleName === 'publisher');
}

export function resolveActiveNavigationSurfaces(ctx: NavigationContext): NavigationSurface[] {
  const surfaces: NavigationSurface[] = [];

  if (isReader(ctx.systemRoles)) surfaces.push('reader');
  if (isAuthor(ctx.systemRoles)) surfaces.push('author');
  if (isAdmin(ctx.systemRoles) && !isSuperAdmin(ctx.systemRoles)) surfaces.push('platform_admin');
  if (isSuperAdmin(ctx.systemRoles)) surfaces.push('super_admin');
  if (hasPublisherNavigationRole(ctx)) surfaces.push('publisher');

  return surfaces;
}

export function canCreateContent(ctx: NavigationContext): boolean {
  return resolveActiveNavigationSurfaces(ctx).some((surface) => CONTENT_CREATION_MATRIX[surface]);
}

function collectPaths(items: SiteNavItem[]): string[] {
  const paths: string[] = [];
  for (const item of items) {
    if (item.children?.length) {
      paths.push(...collectPaths(item.children));
    } else if (item.path) {
      paths.push(item.path);
    }
  }
  return paths;
}

function dedupeMenuItems(items: SiteNavItem[]): SiteNavItem[] {
  const seen = new Set<string>();
  const result: SiteNavItem[] = [];

  for (const item of items) {
    if (item.action === 'logout') {
      if (!seen.has('__logout__')) {
        seen.add('__logout__');
        result.push(item);
      }
      continue;
    }

    if (item.children?.length) {
      const childPaths = collectPaths(item.children);
      const isDuplicateGroup = childPaths.every((path) => seen.has(path));
      if (isDuplicateGroup) continue;
      childPaths.forEach((path) => seen.add(path));
      result.push(item);
      continue;
    }

    const key = item.path ?? item.id;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }

  return result;
}

export interface BuildDynamicMenuOptions {
  surfaces?: NavigationSurface[];
  includeLogout?: boolean;
}

export function buildDynamicMenuItems(
  ctx: NavigationContext,
  options: BuildDynamicMenuOptions = {}
): SiteNavItem[] {
  const activeSurfaces = options.surfaces ?? resolveActiveNavigationSurfaces(ctx);
  const items: SiteNavItem[] = [];

  if (activeSurfaces.includes('reader')) items.push(...READER_NAV);
  if (activeSurfaces.includes('author')) {
    items.push(...AUTHOR_SHELL_MENU.filter((item) => item.action !== 'logout'));
  }
  if (activeSurfaces.includes('platform_admin')) items.push(...PLATFORM_ADMIN_NAV_ITEMS);
  if (activeSurfaces.includes('super_admin')) items.push(...SUPER_ADMIN_NAV);
  if (activeSurfaces.includes('publisher')) items.push(...PUBLISHER_NAV);
  if (options.includeLogout !== false) items.push(LOGOUT_ITEM);

  return dedupeMenuItems(items);
}

export function buildReaderDashboardMenu(ctx: NavigationContext): SiteNavItem[] {
  const readerItems: SiteNavItem[] = [
    { id: 'dashboard', label: 'Dashboard', path: '/reader', icon: LayoutDashboard },
    ...READER_NAV.filter((item) => item.id !== 'home' && item.id !== 'books'),
  ];

  const elevated = buildDynamicMenuItems(ctx, {
    surfaces: resolveActiveNavigationSurfaces(ctx).filter((surface) => surface !== 'reader'),
    includeLogout: false,
  });

  return dedupeMenuItems([...readerItems, ...elevated]);
}

export function buildAuthorShellMenu(ctx: NavigationContext): SiteNavItem[] {
  return buildDynamicMenuItems(ctx, {
    surfaces: resolveActiveNavigationSurfaces(ctx).filter(
      (surface) => surface === 'reader' || surface === 'author'
    ),
    includeLogout: true,
  });
}

export function resolveActiveDashboardSurfaces(ctx: NavigationContext): NavigationSurface[] {
  return resolveActiveNavigationSurfaces(ctx);
}

export function getNavigationCapabilityMatrix(ctx: NavigationContext): Record<NavigationSurface, boolean> {
  const active = new Set(resolveActiveNavigationSurfaces(ctx));
  return {
    reader: active.has('reader'),
    author: active.has('author'),
    platform_admin: active.has('platform_admin'),
    super_admin: active.has('super_admin'),
    publisher: active.has('publisher'),
  };
}

export function getRoleMatrixSummary(ctx: NavigationContext): Record<string, string[]> {
  const summary: Record<string, string[]> = {};

  if (isReader(ctx.systemRoles)) summary.reader = [...ROLE_MODEL.reader];
  if (isAuthor(ctx.systemRoles)) summary.author = [...ROLE_MODEL.author];
  if (isAdmin(ctx.systemRoles) && !isSuperAdmin(ctx.systemRoles)) summary.admin = [...ROLE_MODEL.admin];
  if (isSuperAdmin(ctx.systemRoles)) summary.super_admin = [...ROLE_MODEL.super_admin];
  if (hasPublisherNavigationRole(ctx)) summary.publisher = [...ROLE_MODEL.publisher];

  return summary;
}

export type { LucideIcon };
