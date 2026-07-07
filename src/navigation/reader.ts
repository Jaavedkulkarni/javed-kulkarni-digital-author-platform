import {
  BookOpen,
  Compass,
  Crown,
  Heart,
  ShoppingBag,
  Star,
} from 'lucide-react';
import { PERMISSIONS } from '../roles/types/permission.types';
import { defineNavigationItem } from './types';
import type { NavigationItem } from './types';

/** Reader role navigation foundation. */
export const READER_NAVIGATION: NavigationItem[] = [
  defineNavigationItem({
    id: 'reader-read',
    title: 'Read',
    icon: BookOpen,
    path: '/reader/library',
    requiredRoles: ['reader'],
    requiredPermissions: [PERMISSIONS.reader.library],
    sortOrder: 100,
    section: 'reader',
  }),
  defineNavigationItem({
    id: 'reader-discover',
    title: 'Discover',
    icon: Compass,
    path: '/books',
    requiredRoles: ['reader'],
    requiredPermissions: [PERMISSIONS.reader.read],
    sortOrder: 110,
    section: 'reader',
  }),
  defineNavigationItem({
    id: 'reader-wishlist',
    title: 'Wishlist',
    icon: Heart,
    path: '/reader/wishlist',
    requiredRoles: ['reader'],
    requiredPermissions: [PERMISSIONS.reader.wishlist],
    sortOrder: 120,
    section: 'reader',
  }),
  defineNavigationItem({
    id: 'reader-orders',
    title: 'Orders',
    icon: ShoppingBag,
    path: '/reader/orders',
    requiredRoles: ['reader'],
    requiredPermissions: [PERMISSIONS.reader.purchase],
    sortOrder: 130,
    section: 'reader',
  }),
  defineNavigationItem({
    id: 'reader-membership',
    title: 'Membership',
    icon: Crown,
    path: '/reader/membership',
    requiredRoles: ['reader'],
    sortOrder: 140,
    section: 'reader',
  }),
  defineNavigationItem({
    id: 'reader-reviews',
    title: 'Reviews',
    icon: Star,
    path: '/reader/reviews',
    requiredRoles: ['reader'],
    requiredPermissions: [PERMISSIONS.reader.view],
    sortOrder: 150,
    section: 'reader',
  }),
];
