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
  DollarSign,
  Shield,
  CreditCard,
  FileText,
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { getUserRole, isAdminUser, isReaderUser } from './authRoles';

export interface SiteNavItem {
  id: string;
  label: string;
  path?: string;
  icon: LucideIcon;
  action?: 'logout';
  external?: boolean;
  /** Reserved for future roles — not rendered until enabled */
  future?: boolean;
}

export const PUBLIC_SITE_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Books', path: '/#books' },
  { label: 'Blog', path: '/blog' },
  { label: 'Store', path: 'https://www.amazon.in/stores/Javed-Kulkarni/author/B0FP584D9C', external: true },
] as const;

/** Reader dropdown items (active) */
export const READER_MENU_ITEMS: SiteNavItem[] = [
  { id: 'library', label: 'My Library', path: '/reader/library', icon: BookOpen },
  { id: 'wishlist', label: 'Wishlist', path: '/reader/wishlist', icon: Heart },
  { id: 'history', label: 'Reading History', path: '/reader/history', icon: History },
  { id: 'profile', label: 'Profile', path: '/reader/profile', icon: User },
  { id: 'membership', label: 'Membership', path: '/reader/membership', icon: Crown },
  { id: 'settings', label: 'Settings', path: '/reader/settings', icon: Settings },
  { id: 'logout', label: 'Logout', icon: LogOut, action: 'logout' },
];

/** Admin dropdown when admin visits public site */
export const ADMIN_MENU_ITEMS: SiteNavItem[] = [
  { id: 'cms', label: 'CMS', path: '/admin', icon: LayoutDashboard },
  { id: 'products', label: 'Products', path: '/admin/products', icon: ShoppingBag },
  { id: 'media', label: 'Media', path: '/admin/media', icon: Image },
  { id: 'readers', label: 'Readers', path: '/admin/subscribers', icon: Users },
  { id: 'settings', label: 'Settings', path: '/admin/settings', icon: Settings },
];

/** Future roles — architecture only */
export const AUTHOR_MENU_ITEMS: SiteNavItem[] = [
  { id: 'studio', label: 'Author Studio', path: '/author/studio', icon: PenTool, future: true },
  { id: 'books', label: 'My Books', path: '/author/books', icon: BookOpen, future: true },
  { id: 'analytics', label: 'Analytics', path: '/author/analytics', icon: BarChart3, future: true },
  { id: 'sales', label: 'Sales', path: '/author/sales', icon: DollarSign, future: true },
];

export const SUPER_ADMIN_MENU_ITEMS: SiteNavItem[] = [
  { id: 'system', label: 'System', path: '/super/system', icon: Shield, future: true },
  { id: 'users', label: 'Users', path: '/super/users', icon: Users, future: true },
  { id: 'roles', label: 'Roles', path: '/super/roles', icon: Settings, future: true },
  { id: 'payments', label: 'Payments', path: '/super/payments', icon: CreditCard, future: true },
  { id: 'logs', label: 'Logs', path: '/super/logs', icon: FileText, future: true },
];

export type NavRole = 'guest' | 'reader' | 'admin' | 'author' | 'super_admin';

export function resolveNavRole(user: SupabaseUser | null, isReaderAuthenticated: boolean): NavRole {
  if (!user) return 'guest';
  if (isReaderAuthenticated && isReaderUser(user)) return 'reader';
  if (isAdminUser(user)) return 'admin';
  const role = getUserRole(user);
  if (role === 'reader') return 'reader';
  return 'guest';
}

export function getAuthenticatedMenuItems(role: NavRole): SiteNavItem[] {
  switch (role) {
    case 'reader':
      return READER_MENU_ITEMS;
    case 'admin':
      return ADMIN_MENU_ITEMS;
    case 'author':
      return AUTHOR_MENU_ITEMS.filter((item) => !item.future);
    case 'super_admin':
      return SUPER_ADMIN_MENU_ITEMS.filter((item) => !item.future);
    default:
      return [];
  }
}
