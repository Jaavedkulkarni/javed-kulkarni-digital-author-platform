import {
  HelpCircle,
  LayoutDashboard,
  Bell,
  Search,
  User,
  UserCircle,
} from 'lucide-react';
import { defineNavigationItem } from './types';
import type { NavigationItem } from './types';

/** Shared foundation present for every authenticated AuthorOS identity. */
export const COMMON_NAVIGATION: NavigationItem[] = [
  defineNavigationItem({
    id: 'common-dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/reader',
    requiredRoles: ['reader', 'author', 'admin', 'super_admin', 'publisher'],
    sortOrder: 10,
    section: 'common',
    description: 'Unified AuthorOS dashboard entry point.',
  }),
  defineNavigationItem({
    id: 'common-notifications',
    title: 'Notifications',
    icon: Bell,
    path: '/reader/notifications',
    requiredRoles: ['reader', 'author', 'admin', 'super_admin', 'publisher'],
    sortOrder: 20,
    section: 'common',
  }),
  defineNavigationItem({
    id: 'common-search',
    title: 'Search',
    icon: Search,
    path: '/search',
    action: 'search',
    requiredRoles: ['reader', 'author', 'admin', 'super_admin', 'publisher'],
    sortOrder: 30,
    section: 'common',
  }),
  defineNavigationItem({
    id: 'common-profile',
    title: 'Profile',
    icon: User,
    path: '/reader/profile',
    requiredRoles: ['reader', 'author', 'admin', 'super_admin', 'publisher'],
    sortOrder: 40,
    section: 'common',
  }),
  defineNavigationItem({
    id: 'common-account',
    title: 'Account',
    icon: UserCircle,
    path: '/reader/settings',
    requiredRoles: ['reader', 'author', 'admin', 'super_admin', 'publisher'],
    sortOrder: 50,
    section: 'common',
  }),
  defineNavigationItem({
    id: 'common-help',
    title: 'Help',
    icon: HelpCircle,
    path: '/help',
    requiredRoles: ['reader', 'author', 'admin', 'super_admin', 'publisher'],
    sortOrder: 60,
    section: 'common',
  }),
];
