import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { createPublisherProfileRepository } from './publisherRepository';

export function createPublisherRepositories(client: TypedSupabaseClient) {
  return {
    profile: createPublisherProfileRepository(client),
  };
}

export type PublisherRepositories = ReturnType<typeof createPublisherRepositories>;
