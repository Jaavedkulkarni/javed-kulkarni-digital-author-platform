import type {
  BookPermission,
  CmsPermission,
  CorePermission,
  MembershipPermission,
  OrderPermission,
  AnalyticsPermission,
  PermissionGroup,
  PermissionGroupDefinition,
} from '../types/permission.types';

export const BOOK_PERMISSIONS: readonly BookPermission[] = [
  'books:read',
  'books:purchase',
  'books:bookmark',
  'books:wishlist',
  'books:review',
  'books:comment',
  'books:manage_own',
  'books:manage_all',
  'books:publish',
] as const;

export const CMS_PERMISSIONS: readonly CmsPermission[] = [
  'cms:view',
  'cms:manage_books',
  'cms:manage_authors',
  'cms:manage_publishers',
  'cms:manage_categories',
  'cms:manage_series',
  'cms:manage_chapters',
  'cms:workflow',
] as const;

export const ORDER_PERMISSIONS: readonly OrderPermission[] = [
  'orders:view_own',
  'orders:view_all',
  'orders:manage',
  'orders:refund',
] as const;

export const ANALYTICS_PERMISSIONS: readonly AnalyticsPermission[] = [
  'analytics:view_own',
  'analytics:view_all',
  'analytics:export',
] as const;

export const MEMBERSHIP_PERMISSIONS: readonly MembershipPermission[] = [
  'membership:view',
  'membership:manage',
  'membership:purchase',
] as const;

export const PERMISSION_GROUPS: readonly PermissionGroupDefinition[] = [
  { id: 'books', label: 'Book Permissions', permissions: BOOK_PERMISSIONS },
  { id: 'cms', label: 'CMS Permissions', permissions: CMS_PERMISSIONS },
  { id: 'orders', label: 'Order Permissions', permissions: ORDER_PERMISSIONS },
  { id: 'analytics', label: 'Analytics Permissions', permissions: ANALYTICS_PERMISSIONS },
  { id: 'membership', label: 'Membership Permissions', permissions: MEMBERSHIP_PERMISSIONS },
] as const;

export const ALL_CORE_PERMISSIONS: readonly CorePermission[] = PERMISSION_GROUPS.flatMap(
  (group) => group.permissions
);

export function getPermissionGroup(permission: CorePermission): PermissionGroup | null {
  for (const group of PERMISSION_GROUPS) {
    if ((group.permissions as readonly string[]).includes(permission)) {
      return group.id;
    }
  }
  return null;
}

export function getPermissionsForGroup(group: PermissionGroup): readonly CorePermission[] {
  const definition = PERMISSION_GROUPS.find((entry) => entry.id === group);
  return definition?.permissions ?? [];
}
