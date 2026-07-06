import type { AuthRole } from '../../auth/types/roles.types';

export type CoreRole = AuthRole;

export type PermissionGroup =
  | 'books'
  | 'cms'
  | 'orders'
  | 'analytics'
  | 'membership';

export type BookPermission =
  | 'books:read'
  | 'books:purchase'
  | 'books:bookmark'
  | 'books:wishlist'
  | 'books:review'
  | 'books:comment'
  | 'books:manage_own'
  | 'books:manage_all'
  | 'books:publish';

export type CmsPermission =
  | 'cms:view'
  | 'cms:manage_books'
  | 'cms:manage_authors'
  | 'cms:manage_publishers'
  | 'cms:manage_categories'
  | 'cms:manage_series'
  | 'cms:manage_chapters'
  | 'cms:workflow';

export type OrderPermission =
  | 'orders:view_own'
  | 'orders:view_all'
  | 'orders:manage'
  | 'orders:refund';

export type AnalyticsPermission =
  | 'analytics:view_own'
  | 'analytics:view_all'
  | 'analytics:export';

export type MembershipPermission =
  | 'membership:view'
  | 'membership:manage'
  | 'membership:purchase';

export type CorePermission =
  | BookPermission
  | CmsPermission
  | OrderPermission
  | AnalyticsPermission
  | MembershipPermission;

export interface PermissionCheckContext {
  roles: CoreRole[];
  permission: CorePermission;
  resourceOwnerId?: string;
  actorId?: string;
}

export interface PermissionCheckResult {
  allowed: boolean;
  roles: CoreRole[];
  permission: CorePermission;
  reason?: string;
}

export interface PermissionGroupDefinition {
  id: PermissionGroup;
  label: string;
  permissions: readonly CorePermission[];
}
