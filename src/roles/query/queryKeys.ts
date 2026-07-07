export const roleQueryKeys = {
  all: ['roles'] as const,
  currentUser: (userId: string) => [...roleQueryKeys.all, 'current-user', userId] as const,
  assignments: (userId: string) => [...roleQueryKeys.all, 'assignments', userId] as const,
  assignmentHistory: (userId: string) => [...roleQueryKeys.all, 'assignment-history', userId] as const,
  systemRoles: () => [...roleQueryKeys.all, 'system'] as const,
  permissions: (userId: string) => [...roleQueryKeys.all, 'permissions', userId] as const,
};
