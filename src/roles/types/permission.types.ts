import type { SystemRole } from '../../types/roles';

/**
 * Centralized permission registry — never use raw strings in pages or components.
 */
export const PERMISSIONS = {
  reader: {
    read: 'reader.read',
    library: 'reader.library',
    wishlist: 'reader.wishlist',
    purchase: 'reader.purchase',
    view: 'reader.view',
  },
  author: {
    books: {
      view: 'author.books.view',
      create: 'author.books.create',
      edit: 'author.books.edit',
      delete: 'author.books.delete',
      publish: 'author.books.publish',
      export: 'author.books.export',
      import: 'author.books.import',
      manage: 'author.books.manage',
    },
    blogs: {
      view: 'author.blogs.view',
      create: 'author.blogs.create',
      edit: 'author.blogs.edit',
      delete: 'author.blogs.delete',
      publish: 'author.blogs.publish',
      manage: 'author.blogs.manage',
    },
    analytics: {
      view: 'author.analytics.view',
      manage: 'author.analytics.manage',
    },
    media: {
      view: 'author.media.view',
      create: 'author.media.create',
      edit: 'author.media.edit',
      delete: 'author.media.delete',
      manage: 'author.media.manage',
    },
  },
  publisher: {
    jobs: {
      view: 'publisher.jobs.view',
      create: 'publisher.jobs.create',
      edit: 'publisher.jobs.edit',
      delete: 'publisher.jobs.delete',
      manage: 'publisher.jobs.manage',
    },
    rfq: {
      view: 'publisher.rfq.view',
      create: 'publisher.rfq.create',
      edit: 'publisher.rfq.edit',
      delete: 'publisher.rfq.delete',
      manage: 'publisher.rfq.manage',
    },
    quotes: {
      view: 'publisher.quotes.view',
      create: 'publisher.quotes.create',
      edit: 'publisher.quotes.edit',
      delete: 'publisher.quotes.delete',
      manage: 'publisher.quotes.manage',
    },
  },
  admin: {
    review: {
      view: 'admin.review.view',
      approve: 'admin.review.approve',
      reject: 'admin.review.reject',
      manage: 'admin.review.manage',
    },
    users: {
      view: 'admin.users.view',
      create: 'admin.users.create',
      edit: 'admin.users.edit',
      delete: 'admin.users.delete',
      manage: 'admin.users.manage',
    },
    content: {
      view: 'admin.content.view',
      approve: 'admin.content.approve',
      reject: 'admin.content.reject',
      manage: 'admin.content.manage',
    },
  },
  super: {
    platform: {
      view: 'super.platform.view',
      manage: 'super.platform.manage',
    },
    users: {
      view: 'super.users.view',
      create: 'super.users.create',
      edit: 'super.users.edit',
      delete: 'super.users.delete',
      manage: 'super.users.manage',
    },
    settings: {
      view: 'super.settings.view',
      edit: 'super.settings.edit',
      manage: 'super.settings.manage',
    },
  },
} as const;

type DeepPermissionValues<T> = T extends string
  ? T
  : T extends Record<string, unknown>
    ? DeepPermissionValues<T[keyof T]>
    : never;

export type RolePermission = DeepPermissionValues<typeof PERMISSIONS>;

function collectPermissionValues(node: Record<string, unknown>, acc: RolePermission[] = []): RolePermission[] {
  for (const value of Object.values(node)) {
    if (typeof value === 'string') acc.push(value as RolePermission);
    else if (value && typeof value === 'object') collectPermissionValues(value as Record<string, unknown>, acc);
  }
  return acc;
}

export const ALL_ROLE_PERMISSIONS: RolePermission[] = collectPermissionValues(
  PERMISSIONS as unknown as Record<string, unknown>
);

const READER_PERMISSIONS: RolePermission[] = [
  PERMISSIONS.reader.read,
  PERMISSIONS.reader.library,
  PERMISSIONS.reader.wishlist,
  PERMISSIONS.reader.purchase,
  PERMISSIONS.reader.view,
];

const AUTHOR_PERMISSIONS: RolePermission[] = [
  ...READER_PERMISSIONS,
  ...collectPermissionValues(PERMISSIONS.author as unknown as Record<string, unknown>),
];

const PUBLISHER_PERMISSIONS: RolePermission[] = [
  PERMISSIONS.reader.read,
  PERMISSIONS.reader.library,
  PERMISSIONS.reader.view,
  ...collectPermissionValues(PERMISSIONS.publisher as unknown as Record<string, unknown>),
];

const ADMIN_PERMISSIONS: RolePermission[] = [
  PERMISSIONS.reader.read,
  PERMISSIONS.reader.view,
  ...collectPermissionValues(PERMISSIONS.admin as unknown as Record<string, unknown>),
];

export const ROLE_PERMISSION_MATRIX: Record<SystemRole, RolePermission[]> = {
  reader: READER_PERMISSIONS,
  author: AUTHOR_PERMISSIONS,
  publisher: PUBLISHER_PERMISSIONS,
  admin: ADMIN_PERMISSIONS,
  super_admin: ALL_ROLE_PERMISSIONS,
};

/** @deprecated Use PERMISSIONS — kept for backward compatibility */
export const ROLE_PERMISSIONS = {
  'reader.read': PERMISSIONS.reader.read,
  'reader.library': PERMISSIONS.reader.library,
  'reader.wishlist': PERMISSIONS.reader.wishlist,
  'reader.purchase': PERMISSIONS.reader.purchase,
  'author.books': PERMISSIONS.author.books.view,
  'author.blogs': PERMISSIONS.author.blogs.view,
  'author.analytics': PERMISSIONS.author.analytics.view,
  'author.media': PERMISSIONS.author.media.view,
  'publisher.jobs': PERMISSIONS.publisher.jobs.view,
  'publisher.rfq': PERMISSIONS.publisher.rfq.view,
  'publisher.quotes': PERMISSIONS.publisher.quotes.view,
  'admin.review': PERMISSIONS.admin.review.view,
  'admin.approve': PERMISSIONS.admin.review.approve,
  'admin.reject': PERMISSIONS.admin.review.reject,
  'admin.users': PERMISSIONS.admin.users.view,
  'super.platform': PERMISSIONS.super.platform.manage,
  'super.users': PERMISSIONS.super.users.manage,
  'super.settings': PERMISSIONS.super.settings.manage,
} as const;

export interface PermissionCheckResult {
  allowed: boolean;
  permission: RolePermission;
  matchedRoles: SystemRole[];
}

export type PermissionAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'publish'
  | 'export'
  | 'import'
  | 'manage';

export type PermissionResource =
  | 'reader.read'
  | 'reader.library'
  | 'author.books'
  | 'author.blogs'
  | 'author.analytics'
  | 'author.media'
  | 'publisher.jobs'
  | 'publisher.rfq'
  | 'publisher.quotes'
  | 'admin.review'
  | 'admin.users'
  | 'admin.content'
  | 'super.platform'
  | 'super.users'
  | 'super.settings';

export type PermissionScope = 'reader' | 'author' | 'publisher' | 'admin' | 'super';
