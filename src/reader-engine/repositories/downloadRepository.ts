import type { Tables, TablesInsert, TablesUpdate } from '../../types/database';
import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import { eq } from '../../lib/utils/filters';
import type { DigitalFormat } from '../../types/database';

export class EngineDownloadRepository extends BaseRepository<'downloads'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'downloads', { softDelete: true });
  }

  async findByUserAndBook(userId: string, bookId: string, format?: DigitalFormat): Promise<Tables<'downloads'>[]> {
    const conditions = [eq('user_id', userId), eq('book_id', bookId)];
    if (format) conditions.push(eq('format', format));
    return this.findMany({ filters: { conditions, match: 'all' } });
  }

  async findByUser(userId: string): Promise<Tables<'downloads'>[]> {
    return this.findMany({
      filters: { conditions: [eq('user_id', userId)], match: 'all' },
      sort: { sortBy: 'updated_at', sortDirection: 'desc' },
    });
  }

  async upsertDownload(payload: TablesInsert<'downloads'>): Promise<Tables<'downloads'>> {
    const existing = await this.findMany({
      filters: {
        conditions: [
          eq('user_id', payload.user_id),
          eq('book_id', payload.book_id),
          eq('format', payload.format),
        ],
        match: 'all',
      },
      pagination: { page: 1, pageSize: 1 },
    });
    if (existing[0]) {
      return this.update(existing[0].id, payload as TablesUpdate<'downloads'>);
    }
    return this.create(payload);
  }
}

export function createEngineDownloadRepository(client: TypedSupabaseClient): EngineDownloadRepository {
  return new EngineDownloadRepository(client);
}
