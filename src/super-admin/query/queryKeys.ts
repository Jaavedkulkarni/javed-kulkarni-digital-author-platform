export const superAdminQueryKeys = {
  all: ['super-admin'] as const,
  context: (id: string) => [...superAdminQueryKeys.all, 'context', id] as const,
  executive: () => [...superAdminQueryKeys.all, 'executive'] as const,
  people: (filters?: string) => [...superAdminQueryKeys.all, 'people', filters ?? 'all'] as const,
  publishers: () => [...superAdminQueryKeys.all, 'publishers'] as const,
  authors: () => [...superAdminQueryKeys.all, 'authors'] as const,
  platformAdmins: () => [...superAdminQueryKeys.all, 'platform-admins'] as const,
  business: () => [...superAdminQueryKeys.all, 'business'] as const,
  platform: () => [...superAdminQueryKeys.all, 'platform-config'] as const,
  analytics: () => [...superAdminQueryKeys.all, 'analytics'] as const,
  security: () => [...superAdminQueryKeys.all, 'security'] as const,
  mindwave: () => [...superAdminQueryKeys.all, 'mindwave'] as const,
};
