import { getSupabaseFoundation } from '../../lib/supabase/index';
import type { RepositoryRegistry } from '../../lib/repositories';
import { createReaderRepositories, type ReaderRepositories } from '../repositories';

export interface ReaderDataAccess {
  client: ReturnType<typeof getSupabaseFoundation>['client'];
  repositories: RepositoryRegistry;
  readerRepositories: ReaderRepositories;
}

let readerDataAccess: ReaderDataAccess | null = null;

export function getReaderDataAccess(): ReaderDataAccess {
  if (!readerDataAccess) {
    const foundation = getSupabaseFoundation();
    readerDataAccess = {
      client: foundation.client,
      repositories: foundation.repositories,
      readerRepositories: createReaderRepositories(foundation.client),
    };
  }
  return readerDataAccess;
}

export function resetReaderDataAccess(): void {
  readerDataAccess = null;
}
