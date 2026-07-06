import { QueryClient } from '@tanstack/react-query';

export function createOrganizationQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let organizationQueryClient: QueryClient | null = null;

export function getOrganizationQueryClient(): QueryClient {
  if (!organizationQueryClient) organizationQueryClient = createOrganizationQueryClient();
  return organizationQueryClient;
}

export function resetOrganizationQueryClient(): void {
  organizationQueryClient = null;
}
