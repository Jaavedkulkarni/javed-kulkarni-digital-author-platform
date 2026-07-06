export const organizationQueryKeys = {
  all: ['organization'] as const,
  workspace: (userId: string) => [...organizationQueryKeys.all, 'workspace', userId] as const,
  organizations: (userId: string) => [...organizationQueryKeys.all, 'organizations', userId] as const,
  organization: (id: string) => [...organizationQueryKeys.all, 'org', id] as const,
  members: (orgId: string) => [...organizationQueryKeys.all, 'members', orgId] as const,
  roles: (userId: string) => [...organizationQueryKeys.all, 'roles', userId] as const,
  permissions: (userId: string, workspace: string) =>
    [...organizationQueryKeys.all, 'permissions', userId, workspace] as const,
  invitations: (orgId?: string) =>
    [...organizationQueryKeys.all, 'invitations', orgId ?? 'all'] as const,
  audit: (filters?: string) => [...organizationQueryKeys.all, 'audit', filters ?? 'all'] as const,
  verification: (userId: string) => [...organizationQueryKeys.all, 'verification', userId] as const,
};
