import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import { eq } from '../../lib/utils/filters';
import type { Tables } from '../../types/database';

export class ProfileRepository extends BaseRepository<'profiles'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'profiles', { softDelete: false });
  }

  async findByUserId(userId: string): Promise<Tables<'profiles'> | null> {
    return this.findById(userId);
  }

  async findByEmail(email: string): Promise<Tables<'profiles'> | null> {
    const rows = await this.findMany({
      filters: { conditions: [eq('email', email)], match: 'all' },
      pagination: { page: 1, pageSize: 1 },
    });
    return rows[0] ?? null;
  }
}

export function createProfileRepository(client: TypedSupabaseClient): ProfileRepository {
  return new ProfileRepository(client);
}
