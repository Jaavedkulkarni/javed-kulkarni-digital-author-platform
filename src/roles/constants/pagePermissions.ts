import { PERMISSIONS, type RolePermission } from '../types/permission.types';

export type PagePermissionKey =
  | 'reader.dashboard'
  | 'reader.library'
  | 'author.dashboard'
  | 'author.books'
  | 'author.blogs'
  | 'author.analytics'
  | 'publisher.dashboard'
  | 'publisher.jobs'
  | 'publisher.rfq'
  | 'admin.dashboard'
  | 'admin.review'
  | 'admin.users'
  | 'super.dashboard'
  | 'super.platform'
  | 'super.users'
  | 'super.settings';

export const PAGE_PERMISSIONS: Record<PagePermissionKey, RolePermission[]> = {
  'reader.dashboard': [PERMISSIONS.reader.view],
  'reader.library': [PERMISSIONS.reader.library, PERMISSIONS.reader.view],
  'author.dashboard': [PERMISSIONS.author.books.view, PERMISSIONS.author.analytics.view],
  'author.books': [PERMISSIONS.author.books.view],
  'author.blogs': [PERMISSIONS.author.blogs.view],
  'author.analytics': [PERMISSIONS.author.analytics.view],
  'publisher.dashboard': [PERMISSIONS.publisher.jobs.view],
  'publisher.jobs': [PERMISSIONS.publisher.jobs.view],
  'publisher.rfq': [PERMISSIONS.publisher.rfq.view],
  'admin.dashboard': [PERMISSIONS.admin.review.view, PERMISSIONS.admin.content.view],
  'admin.review': [PERMISSIONS.admin.review.view],
  'admin.users': [PERMISSIONS.admin.users.view],
  'super.dashboard': [PERMISSIONS.super.platform.view],
  'super.platform': [PERMISSIONS.super.platform.view],
  'super.users': [PERMISSIONS.super.users.view],
  'super.settings': [PERMISSIONS.super.settings.view],
};

export type FeaturePermissionKey =
  | 'reader.experience'
  | 'author.workspace'
  | 'publisher.workspace'
  | 'admin.moderation'
  | 'admin.userManagement'
  | 'super.control';

export const FEATURE_PERMISSIONS: Record<FeaturePermissionKey, RolePermission[]> = {
  'reader.experience': [PERMISSIONS.reader.read, PERMISSIONS.reader.library],
  'author.workspace': [PERMISSIONS.author.books.view, PERMISSIONS.author.blogs.view],
  'publisher.workspace': [PERMISSIONS.publisher.jobs.view, PERMISSIONS.publisher.rfq.view],
  'admin.moderation': [PERMISSIONS.admin.review.view, PERMISSIONS.admin.content.view],
  'admin.userManagement': [PERMISSIONS.admin.users.manage],
  'super.control': [PERMISSIONS.super.platform.manage],
};

export type RoutePermissionKey = PagePermissionKey;

export const ROUTE_PERMISSIONS: Record<RoutePermissionKey, RolePermission[]> = PAGE_PERMISSIONS;
