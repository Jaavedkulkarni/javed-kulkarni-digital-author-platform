import {
  BarChart3,
  Bell,
  BookOpen,
  Crown,
  Heart,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  User,
} from 'lucide-react';
import type { SiteNavItem } from './siteNavigation';
import type { SystemRole } from '../types/roles';
import type { UserRoleAssignment } from '../organization/types/role.types';
import type { AuthRole } from '../auth/types/roles.types';
import { buildReaderDashboardMenu, type NavigationContext } from './navigationArchitecture';

/** Static reader-only menu — prefer buildReaderDashboardMenuItems for multi-role users. */
export const READER_DASHBOARD_MENU: SiteNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/reader', icon: LayoutDashboard },
  { id: 'library', label: 'My Library', path: '/reader/library', icon: BookOpen },
  { id: 'wishlist', label: 'Wishlist', path: '/reader/wishlist', icon: Heart },
  { id: 'orders', label: 'Orders', path: '/reader/orders', icon: ShoppingBag },
  { id: 'membership', label: 'Membership', path: '/reader/membership', icon: Crown },
  { id: 'reading-insights', label: 'Reading Insights', path: '/reader/reading-insights', icon: BarChart3 },
  { id: 'notifications', label: 'Notifications', path: '/reader/notifications', icon: Bell },
  { id: 'profile', label: 'Profile', path: '/reader/profile', icon: User },
  { id: 'settings', label: 'Settings', path: '/reader/settings', icon: Settings },
];

export function buildReaderDashboardMenuItems(params: {
  systemRoles: SystemRole[];
  assignments?: UserRoleAssignment[];
  authRoles?: AuthRole[];
}): SiteNavItem[] {
  const ctx: NavigationContext = {
    systemRoles: params.systemRoles,
    assignments: params.assignments,
    authRoles: params.authRoles,
  };
  return buildReaderDashboardMenu(ctx);
}

export function isDashboardPlaceholderPath(path?: string): boolean {
  return Boolean(path?.startsWith('#'));
}

export type { NavigationContext };
