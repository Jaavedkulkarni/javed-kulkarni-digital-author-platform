import type { LucideIcon } from 'lucide-react';

import {

  BookOpen,

  Heart,

  History,

  User,

  Settings,

  LogOut,

  Crown,

  LayoutDashboard,

  ShoppingBag,

  Image,

  Users,

  FileText,

  Home,

} from 'lucide-react';

import type { User as SupabaseUser } from '@supabase/supabase-js';

import type { SystemRole } from '../types/roles';

import type { UserRoleAssignment } from '../organization/types/role.types';

import type { AuthRole } from '../auth/types/roles.types';

import { AUTHOR_SHELL_MENU } from './authorPaths';

import { SUPER_ADMIN_SHELL_MENU } from './superAdminPaths';

import {

  buildDynamicMenuItems,

  type NavigationContext,

  type NavigationSurface,

} from './navigationArchitecture';

import { resolveNavRoleFromRoles } from './permissions';



export interface SiteNavItem {
  id: string;
  label: string;
  path?: string;
  icon: LucideIcon;
  action?: 'logout';
  external?: boolean;
  /** Nested items for scalable groups (e.g. Author → Content). */
  children?: SiteNavItem[];
}



export const AMAZON_STORE_URL = 'https://www.amazon.in/stores/Javed-Kulkarni/author/B0FP584D9C';



export const PUBLIC_SITE_LINKS = [

  { label: 'मुख्यपृष्ठ', path: '/' },

  { label: 'माझी पुस्तके', path: '/#books' },

  { label: 'लेखन', path: '/#writing' },

  { label: 'स्टोअर', path: AMAZON_STORE_URL, external: true },

  { label: 'माझ्याविषयी', path: '/#about' },

  { label: 'संपर्क', path: '/#contact' },

] as const;



export const FOOTER_QUICK_LINKS = [

  { label: 'माझी पुस्तके', path: '/#books' },

  { label: 'वाचक क्लब', path: '/#reader-club' },

  { label: 'लेखन', path: '/#writing' },

  { label: 'स्टोअर', path: AMAZON_STORE_URL, external: true },

  { label: 'मुख्यपृष्ठ', path: '/#home' },

] as const;



export const FOOTER_BOOK_CATEGORIES = [

  'कथा',

  'कादंबरी',

  'पालकत्व',

  'नातेसंबंध',

  'डिजिटल जीवन',

  'विनोदी कथा',

] as const;



export const MEMBER_AREA_NAV_ITEMS: SiteNavItem[] = [

  { id: 'home', label: 'Home', path: '/', icon: Home },

  { id: 'library', label: 'My Library', path: '/reader/library', icon: BookOpen },

  { id: 'wishlist', label: 'Wishlist', path: '/reader/wishlist', icon: Heart },

  { id: 'history', label: 'Reading History', path: '/reader/history', icon: History },

  { id: 'membership', label: 'Membership', path: '/reader/membership', icon: Crown },

  { id: 'profile', label: 'Profile', path: '/reader/profile', icon: User },

  { id: 'settings', label: 'Settings', path: '/reader/settings', icon: Settings },

];



/** Legacy reader dropdown — superseded by buildPublicAuthenticatedMenuItems. */

export const READER_MENU_ITEMS: SiteNavItem[] = [

  { id: 'home', label: 'Home', path: '/', icon: Home },

  { id: 'books', label: 'Books', path: '/#books', icon: BookOpen },

  { id: 'library', label: 'Library', path: '/reader/library', icon: BookOpen },

  { id: 'orders', label: 'Orders', path: '/reader/orders', icon: ShoppingBag },

  { id: 'profile', label: 'Profile', path: '/reader/profile', icon: User },

  { id: 'logout', label: 'Logout', icon: LogOut, action: 'logout' },

];



export const ADMIN_MENU_ITEMS: SiteNavItem[] = [

  { id: 'dashboard', label: 'Dashboard', path: '/admin', icon: LayoutDashboard },

  { id: 'books', label: 'Books', path: '/admin/books', icon: BookOpen },

  { id: 'articles', label: 'Articles', path: '/admin/articles', icon: FileText },

  { id: 'media', label: 'Media', path: '/admin/media', icon: Image },

  { id: 'readers', label: 'Readers', path: '/admin/subscribers', icon: Users },

  { id: 'logout', label: 'Logout', icon: LogOut, action: 'logout' },

];



export const AUTHOR_MENU_ITEMS: SiteNavItem[] = AUTHOR_SHELL_MENU;



export const SUPER_ADMIN_MENU_ITEMS: SiteNavItem[] = SUPER_ADMIN_SHELL_MENU;



export type NavRole = 'guest' | 'reader' | 'admin' | 'author' | 'super_admin';



export function resolveNavRole(

  user: SupabaseUser | null,

  navRoleFromRoles?: NavRole

): NavRole {

  if (!user) return 'guest';

  if (navRoleFromRoles && navRoleFromRoles !== 'guest') return navRoleFromRoles;

  return 'guest';

}



export function buildNavigationContext(params: {

  systemRoles: SystemRole[];

  assignments?: UserRoleAssignment[];

  authRoles?: AuthRole[];

}): NavigationContext {

  return {

    systemRoles: params.systemRoles,

    assignments: params.assignments,

    authRoles: params.authRoles,

  };

}



/** Dynamic authenticated menu — unions all assigned role sections (no workspace switching). */

export function buildPublicAuthenticatedMenuItems(ctx: NavigationContext): SiteNavItem[] {

  return buildDynamicMenuItems(ctx, { includeLogout: true });

}



/** @deprecated Use buildPublicAuthenticatedMenuItems with full role context. */

export function getPublicAuthenticatedMenuItems(role: NavRole): SiteNavItem[] {

  const systemRole = role === 'guest' ? null : role;

  if (!systemRole) return [];

  return buildPublicAuthenticatedMenuItems({ systemRoles: [systemRole] });

}



export function getNavDisplayName(

  roles: SystemRole[],

  profileName?: string | null,

  email?: string | null

): string {

  if (profileName) return profileName;

  if (email) return email.split('@')[0];

  const navRole = resolveNavRoleFromRoles(roles);

  if (navRole === 'super_admin') return 'Super Admin';

  if (navRole === 'admin') return 'Platform Admin';

  if (navRole === 'author') return 'Author';

  return 'Reader';

}



export type { NavigationContext, NavigationSurface };


