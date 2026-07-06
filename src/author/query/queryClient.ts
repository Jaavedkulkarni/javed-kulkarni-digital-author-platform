import { QueryClient } from '@tanstack/react-query';

export function createAuthorQueryClient(): QueryClient {
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

let authorQueryClient: QueryClient | null = null;

export function getAuthorQueryClient(): QueryClient {
  if (!authorQueryClient) authorQueryClient = createAuthorQueryClient();
  return authorQueryClient;
}

export function resetAuthorQueryClient(): void {
  authorQueryClient = null;
}
