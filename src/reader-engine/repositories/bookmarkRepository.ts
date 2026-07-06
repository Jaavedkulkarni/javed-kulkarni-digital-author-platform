import type { Tables, TablesInsert, TablesUpdate } from '../../types/database';
import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import { eq } from '../../lib/utils/filters';

export class EngineBookmarkRepository extends BaseRepository<'bookmarks'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'bookmarks', { softDelete: true });
  }

  async findByUserAndBook(userId: string, bookId: string): Promise<Tables<'bookmarks'>[]> {
    return this.findMany({
      filters: { conditions: [eq('user_id', userId), eq('book_id', bookId)], match: 'all' },
      sort: { sortBy: 'created_at', sortDirection: 'desc' },
    });
  }

  async createBookmark(payload: TablesInsert<'bookmarks'>): Promise<Tables<'bookmarks'>> {
    return this.create(payload);
  }

  async updateBookmark(id: string, payload: TablesUpdate<'bookmarks'>): Promise<Tables<'bookmarks'>> {
    return this.update(id, payload);
  }

  async softDeleteBookmark(id: string): Promise<void> {
    await this.softDelete(id);
  }
}

export function createEngineBookmarkRepository(client: TypedSupabaseClient): EngineBookmarkRepository {
  return new EngineBookmarkRepository(client);
}
