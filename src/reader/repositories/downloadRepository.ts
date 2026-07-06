import type { Tables } from '../../types/database';
import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import { eq } from '../../lib/utils/filters';

export class ReaderDownloadRepository extends BaseRepository<'downloads'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'downloads', { softDelete: true });
  }

  async findByUser(userId: string): Promise<Tables<'downloads'>[]> {
    return this.findMany({
      filters: { conditions: [eq('user_id', userId)], match: 'all' },
      sort: { sortBy: 'updated_at', sortDirection: 'desc' },
    });
  }
}

export function createReaderDownloadRepository(client: TypedSupabaseClient): ReaderDownloadRepository {
  return new ReaderDownloadRepository(client);
}
