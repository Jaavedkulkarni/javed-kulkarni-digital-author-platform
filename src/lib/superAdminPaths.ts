import {
  BarChart3,
  BookOpen,
  FileText,
  Globe,
  Image,
  LayoutDashboard,
  LogOut,
  Mail,
  Package,
  Settings,
  Shield,
  Users,
} from 'lucide-react';
import type { SiteNavItem } from './siteNavigation';

export const SUPER_ADMIN_SHELL_MENU: SiteNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/super', icon: LayoutDashboard },
  { id: 'website', label: 'Website', path: '/super/website', icon: Globe },
  { id: 'authors', label: 'Authors', path: '/super/authors', icon: Users },
  { id: 'admins', label: 'Admins', path: '/super/admins', icon: Shield },
  { id: 'readers', label: 'Readers', path: '/super/readers', icon: Users },
  { id: 'books', label: 'Books', path: '/super/books', icon: BookOpen },
  { id: 'articles', label: 'Articles', path: '/super/articles', icon: FileText },
  { id: 'products', label: 'Products', path: '/super/products', icon: Package },
  { id: 'media', label: 'Media', path: '/super/media', icon: Image },
  { id: 'newsletter', label: 'Newsletter', path: '/super/newsletter', icon: Mail },
  { id: 'settings', label: 'Settings', path: '/super/settings', icon: Settings },
  { id: 'analytics', label: 'Analytics', path: '/super/analytics', icon: BarChart3 },
  { id: 'logout', label: 'Logout', icon: LogOut, action: 'logout' },
];

export const SUPER_ADMIN_PUBLIC_MENU: SiteNavItem[] = SUPER_ADMIN_SHELL_MENU;
