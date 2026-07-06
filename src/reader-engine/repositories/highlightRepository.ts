import type { Tables, TablesInsert, TablesUpdate } from '../../types/database';
import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import { eq } from '../../lib/utils/filters';

export class EngineHighlightRepository extends BaseRepository<'highlights'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'highlights', { softDelete: true });
  }

  async findByUserAndBook(userId: string, bookId: string): Promise<Tables<'highlights'>[]> {
    return this.findMany({
      filters: { conditions: [eq('user_id', userId), eq('book_id', bookId)], match: 'all' },
      sort: { sortBy: 'created_at', sortDirection: 'desc' },
    });
  }

  async createHighlight(payload: TablesInsert<'highlights'>): Promise<Tables<'highlights'>> {
    return this.create(payload);
  }

  async updateHighlight(id: string, payload: TablesUpdate<'highlights'>): Promise<Tables<'highlights'>> {
    return this.update(id, payload);
  }

  async softDeleteHighlight(id: string): Promise<void> {
    await this.softDelete(id);
  }
}

export function createEngineHighlightRepository(client: TypedSupabaseClient): EngineHighlightRepository {
  return new EngineHighlightRepository(client);
}
