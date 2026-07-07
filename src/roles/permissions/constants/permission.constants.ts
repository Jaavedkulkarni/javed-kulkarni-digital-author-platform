import type { PermissionGroup } from '../types/permission.types';

export const PERMISSION_REGISTRY_VERSION = '1.0.0';

/** Display labels for permission groups. */
export const PERMISSION_GROUP_LABELS: Readonly<Record<PermissionGroup, string>> = {
  reader: 'Reader',
  author: 'Author',
  platform_admin: 'Platform Admin',
  super_admin: 'Super Admin',
  publisher: 'Publisher',
};

/** Ordered permission groups for deterministic iteration. */
export const PERMISSION_GROUPS: readonly PermissionGroup[] = [
  'reader',
  'author',
  'platform_admin',
  'super_admin',
  'publisher',
] as const;

/** Ergonomic permission key accessors — never hardcode raw strings in components. */
export const PERMISSION_KEYS = {
  reader: {
    read: 'reader.read',
    library: 'reader.library',
    wishlist: 'reader.wishlist',
    orders: {
      view: 'reader.orders.view',
      manage: 'reader.orders.manage',
    },
    membership: {
      manage: 'reader.membership.manage',
    },
    reviews: {
      view: 'reader.reviews.view',
      create: 'reader.reviews.create',
    },
  },
  author: {
    books: {
      view: 'author.books.view',
      create: 'author.books.create',
      edit: 'author.books.edit',
      delete: 'author.books.delete',
      publish: 'author.books.publish',
    },
    blogs: {
      view: 'author.blogs.view',
      create: 'author.blogs.create',
      edit: 'author.blogs.edit',
      delete: 'author.blogs.delete',
      publish: 'author.blogs.publish',
    },
    articles: {
      create: 'author.articles.create',
      edit: 'author.articles.edit',
      delete: 'author.articles.delete',
    },
    stories: {
      create: 'author.stories.create',
      edit: 'author.stories.edit',
      delete: 'author.stories.delete',
    },
    poems: {
      create: 'author.poems.create',
      edit: 'author.poems.edit',
      delete: 'author.poems.delete',
    },
    media: {
      view: 'author.media.view',
      upload: 'author.media.upload',
      manage: 'author.media.manage',
    },
    analytics: {
      view: 'author.analytics.view',
    },
    earnings: {
      view: 'author.earnings.view',
    },
  },
  platform: {
    review: {
      view: 'platform.review.view',
      approve: 'platform.review.approve',
      reject: 'platform.review.reject',
    },
    content: {
      manage: 'platform.content.manage',
    },
    categories: {
      manage: 'platform.categories.manage',
    },
    featured: {
      manage: 'platform.featured.manage',
    },
    reports: {
      view: 'platform.reports.view',
    },
  },
  super: {
    users: {
      manage: 'super.users.manage',
    },
    roles: {
      manage: 'super.roles.manage',
    },
    permissions: {
      manage: 'super.permissions.manage',
    },
    organizations: {
      manage: 'super.organizations.manage',
    },
    authors: {
      manage: 'super.authors.manage',
    },
    publishers: {
      manage: 'super.publishers.manage',
    },
    settings: {
      manage: 'super.settings.manage',
    },
    security: {
      manage: 'super.security.manage',
    },
    audit: {
      view: 'super.audit.view',
    },
    analytics: {
      view: 'super.analytics.view',
    },
    maintenance: {
      manage: 'super.maintenance.manage',
    },
    integrations: {
      manage: 'super.integrations.manage',
    },
    navigation: {
      manage: 'super.navigation.manage',
    },
    workflow: {
      manage: 'super.workflow.manage',
    },
    backup: {
      manage: 'super.backup.manage',
    },
  },
  publisher: {
    rfq: {
      manage: 'publisher.rfq.manage',
    },
    jobs: {
      manage: 'publisher.jobs.manage',
    },
    production: {
      manage: 'publisher.production.manage',
    },
    dispatch: {
      manage: 'publisher.dispatch.manage',
    },
    tracking: {
      view: 'publisher.tracking.view',
    },
    billing: {
      manage: 'publisher.billing.manage',
    },
  },
} as const;

type DeepPermissionKeyValues<T> = T extends string
  ? T
  : T extends Record<string, unknown>
    ? DeepPermissionKeyValues<T[keyof T]>
    : never;

export type PermissionKey = DeepPermissionKeyValues<typeof PERMISSION_KEYS>;

function collectPermissionKeys(node: Record<string, unknown>, acc: string[] = []): string[] {
  for (const value of Object.values(node)) {
    if (typeof value === 'string') acc.push(value);
    else if (value && typeof value === 'object') collectPermissionKeys(value as Record<string, unknown>, acc);
  }
  return acc;
}

export const ALL_PERMISSION_KEYS: readonly PermissionKey[] = Object.freeze(
  collectPermissionKeys(PERMISSION_KEYS as unknown as Record<string, unknown>) as PermissionKey[],
);
