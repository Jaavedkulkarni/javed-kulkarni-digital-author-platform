import type { Tables } from '../../types/database';
import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import { eq } from '../../lib/utils/filters';

export class ReaderNoteRepository extends BaseRepository<'notes'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'notes', { softDelete: true });
  }

  async findByUser(userId: string, bookId?: string): Promise<Tables<'notes'>[]> {
    const conditions = [eq('user_id', userId)];
    if (bookId) conditions.push(eq('book_id', bookId));
    return this.findMany({
      filters: { conditions, match: 'all' },
      sort: { sortBy: 'created_at', sortDirection: 'desc' },
    });
  }

  async countByUserAndBook(userId: string, bookId: string): Promise<number> {
    const rows = await this.findByUser(userId, bookId);
    return rows.length;
  }
}

export function createReaderNoteRepository(client: TypedSupabaseClient): ReaderNoteRepository {
  return new ReaderNoteRepository(client);
}
