export const platformAdminQueryKeys = {
  all: ['platform-admin'] as const,
  context: (profileId: string) => [...platformAdminQueryKeys.all, 'context', profileId] as const,
  dashboard: () => [...platformAdminQueryKeys.all, 'dashboard'] as const,
  bookReview: () => [...platformAdminQueryKeys.all, 'book-review'] as const,
  blogReview: () => [...platformAdminQueryKeys.all, 'blog-review'] as const,
  paperback: () => [...platformAdminQueryKeys.all, 'paperback'] as const,
  finance: (section?: string) => [...platformAdminQueryKeys.all, 'finance', section ?? 'all'] as const,
  support: (category?: string) => [...platformAdminQueryKeys.all, 'support', category ?? 'all'] as const,
  marketing: () => [...platformAdminQueryKeys.all, 'marketing'] as const,
  authorServices: () => [...platformAdminQueryKeys.all, 'author-services'] as const,
  legal: () => [...platformAdminQueryKeys.all, 'legal'] as const,
  notifications: () => [...platformAdminQueryKeys.all, 'notifications'] as const,
};
