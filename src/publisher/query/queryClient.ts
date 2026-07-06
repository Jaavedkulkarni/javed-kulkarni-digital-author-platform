import { QueryClient } from '@tanstack/react-query';

export function createPublisherQueryClient(): QueryClient {
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

let publisherQueryClient: QueryClient | null = null;

export function getPublisherQueryClient(): QueryClient {
  if (!publisherQueryClient) publisherQueryClient = createPublisherQueryClient();
  return publisherQueryClient;
}

export function resetPublisherQueryClient(): void {
  publisherQueryClient = null;
}
