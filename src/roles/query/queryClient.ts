import { QueryClient } from '@tanstack/react-query';

let roleQueryClient: QueryClient | null = null;

export function getRoleQueryClient(): QueryClient {
  if (!roleQueryClient) {
    roleQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60_000,
          retry: 1,
        },
      },
    });
  }
  return roleQueryClient;
}

export function resetRoleQueryClient(): void {
  roleQueryClient = null;
}
