import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import type { Tables } from '../../types/database';

export class PlatformAdminProfileRepository extends BaseRepository<'profiles'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'profiles', { softDelete: false });
  }

  async findByProfileId(profileId: string): Promise<Tables<'profiles'> | null> {
    return this.findById(profileId);
  }
}

export function createPlatformAdminProfileRepository(
  client: TypedSupabaseClient
): PlatformAdminProfileRepository {
  return new PlatformAdminProfileRepository(client);
}
