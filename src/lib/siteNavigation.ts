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
  PenTool,
  BarChart3,
  Shield,
  FileText,
  Globe,
  Mail,
  Package,
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { isReaderUser } from './authRoles';
import { AUTHOR_PUBLIC_MENU } from './authorPaths';
import { SUPER_ADMIN_PUBLIC_MENU } from './superAdminPaths';

export interface SiteNavItem {
  id: string;
  label: string;
  path?: string;
  icon: LucideIcon;
  action?: 'logout';
  external?: boolean;
}

export const AMAZON_STORE_URL = 'https://www.amazon.in/stores/Javed-Kulkarni/author/B0FP584D9C';

export const PUBLIC_SITE_LINKS = [
  { label: 'मुख्यपृष्ठ', path: '/' },
  { label: 'माझी पुस्तके', path: '/#books' },
  { label: 'लेखन श्रेणी', path: '/#audience' },
  { label: 'ब्लॉग', path: '/blog' },
  { label: 'वाचक क्लब', path: '/#reader-club' },
  { label: 'स्टोअर', path: AMAZON_STORE_URL, external: true },
  { label: 'माझ्याविषयी', path: '/#about' },
  { label: 'संपर्क', path: '/#contact' },
] as const;

export const MEMBER_AREA_NAV_ITEMS: SiteNavItem[] = [
  { id: 'library', label: 'My Library', path: '/reader/library', icon: BookOpen },
  { id: 'wishlist', label: 'Wishlist', path: '/reader/wishlist', icon: Heart },
  { id: 'history', label: 'Reading History', path: '/reader/history', icon: History },
  { id: 'membership', label: 'Membership', path: '/reader/membership', icon: Crown },
  { id: 'profile', label: 'Profile', path: '/reader/profile', icon: User },
  { id: 'settings', label: 'Settings', path: '/reader/settings', icon: Settings },
];

/** Reader dropdown on public pages */
export const READER_MENU_ITEMS: SiteNavItem[] = [
  { id: 'account', label: 'My Account', path: '/reader/profile', icon: User },
  { id: 'bookmarks', label: 'Bookmarks', path: '/reader/wishlist', icon: Heart },
  { id: 'orders', label: 'Orders', path: '/reader/orders', icon: ShoppingBag },
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

export const AUTHOR_MENU_ITEMS: SiteNavItem[] = AUTHOR_PUBLIC_MENU;

export const SUPER_ADMIN_MENU_ITEMS: SiteNavItem[] = SUPER_ADMIN_PUBLIC_MENU;

export type NavRole = 'guest' | 'reader' | 'admin' | 'author' | 'super_admin';

export function resolveNavRole(
  user: SupabaseUser | null,
  isReaderAuthenticated: boolean,
  navRoleFromRoles?: NavRole
): NavRole {
  if (navRoleFromRoles && navRoleFromRoles !== 'guest') return navRoleFromRoles;
  if (!user) return 'guest';
  if (isReaderAuthenticated && isReaderUser(user)) return 'reader';
  return 'guest';
}

export function getPublicAuthenticatedMenuItems(role: NavRole): SiteNavItem[] {
  switch (role) {
    case 'super_admin':
      return SUPER_ADMIN_MENU_ITEMS;
    case 'admin':
      return ADMIN_MENU_ITEMS;
    case 'author':
      return AUTHOR_MENU_ITEMS;
    case 'reader':
      return READER_MENU_ITEMS;
    default:
      return [];
  }
}

export function getNavDisplayName(role: NavRole, profileName?: string | null, email?: string | null): string {
  if (profileName) return profileName;
  if (email) return email.split('@')[0];
  if (role === 'super_admin') return 'Super Admin';
  if (role === 'admin') return 'Admin';
  if (role === 'author') return 'Author';
  return 'Reader';
}
