import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import { eq } from '../../lib/utils/filters';
import type { Tables } from '../../types/database';

export class PublisherProfileRepository extends BaseRepository<'publishers'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'publishers', { softDelete: true });
  }

  async findByProfileId(profileId: string): Promise<Tables<'publishers'> | null> {
    const rows = await this.findMany({
      filters: { conditions: [eq('profile_id', profileId)], match: 'all' },
      pagination: { page: 1, pageSize: 1 },
    });
    return rows[0] ?? null;
  }

  async findById(id: string): Promise<Tables<'publishers'> | null> {
    return super.findById(id);
  }
}

export function createPublisherProfileRepository(
  client: TypedSupabaseClient
): PublisherProfileRepository {
  return new PublisherProfileRepository(client);
}
