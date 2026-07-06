import type { ReadingProgress, TablesInsert, TablesUpdate } from '../../types/database';
import type { TypedSupabaseClient } from '../supabase/clients/browser';
import { BaseRepository } from './baseRepository';
import { eq } from '../utils/filters';

export class ReadingProgressRepository extends BaseRepository<'reading_progress'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'reading_progress', { softDelete: true });
  }

  async findByUser(userId: string): Promise<ReadingProgress[]> {
    return this.findMany({
      filters: { conditions: [eq('user_id', userId)], match: 'all' },
      sort: { sortBy: 'last_read_at', sortDirection: 'desc' },
    });
  }

  async findByUserAndBook(userId: string, bookId: string): Promise<ReadingProgress | null> {
    return this.findMany({
      filters: {
        conditions: [eq('user_id', userId), eq('book_id', bookId)],
        match: 'all',
      },
      pagination: { page: 1, pageSize: 1 },
    }).then((rows) => rows[0] ?? null);
  }

  async upsertProgress(payload: TablesInsert<'reading_progress'>): Promise<ReadingProgress> {
    const existing = await this.findByUserAndBook(payload.user_id, payload.book_id);

    if (existing) {
      return this.update(existing.id, payload as TablesUpdate<'reading_progress'>);
    }

    return this.create(payload);
  }
}

export function createReadingProgressRepository(
  client: TypedSupabaseClient
): ReadingProgressRepository {
  return new ReadingProgressRepository(client);
}
