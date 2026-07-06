import type { Tables } from '../../types/database';
import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import { eq } from '../../lib/utils/filters';

export class AuthorProfileRepository extends BaseRepository<'authors'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'authors', { softDelete: true });
  }

  async findByProfileId(profileId: string): Promise<Tables<'authors'> | null> {
    const rows = await this.findMany({
      filters: { conditions: [eq('profile_id', profileId)], match: 'all' },
      pagination: { page: 1, pageSize: 1 },
    });
    return rows[0] ?? null;
  }
}

export function createAuthorProfileRepository(client: TypedSupabaseClient): AuthorProfileRepository {
  return new AuthorProfileRepository(client);
}
