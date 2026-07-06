import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { createSuperAdminProfileRepository } from './profileRepository';

export function createSuperAdminRepositories(client: TypedSupabaseClient) {
  return { profile: createSuperAdminProfileRepository(client) };
}

export type SuperAdminRepositories = ReturnType<typeof createSuperAdminRepositories>;
