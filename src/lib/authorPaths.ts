import {
  BookOpen,
  FileText,
  Image,
  LayoutDashboard,
  LogOut,
  User,
} from 'lucide-react';
import type { SiteNavItem } from '../../lib/siteNavigation';

export const AUTHOR_SHELL_MENU: SiteNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/author', icon: LayoutDashboard },
  { id: 'books', label: 'Books', path: '/author/books', icon: BookOpen },
  { id: 'articles', label: 'Articles', path: '/author/articles', icon: FileText },
  { id: 'media', label: 'Media', path: '/author/media', icon: Image },
  { id: 'profile', label: 'Profile', path: '/author/profile', icon: User },
  { id: 'logout', label: 'Logout', icon: LogOut, action: 'logout' },
];

export const AUTHOR_PUBLIC_MENU: SiteNavItem[] = AUTHOR_SHELL_MENU;
