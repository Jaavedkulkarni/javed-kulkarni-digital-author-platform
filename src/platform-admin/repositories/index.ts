import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { createPlatformAdminProfileRepository } from './profileRepository';

export function createPlatformAdminRepositories(client: TypedSupabaseClient) {
  return {
    profile: createPlatformAdminProfileRepository(client),
  };
}

export type PlatformAdminRepositories = ReturnType<typeof createPlatformAdminRepositories>;
