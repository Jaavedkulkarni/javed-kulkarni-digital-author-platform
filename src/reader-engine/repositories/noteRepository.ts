import type { Tables, TablesInsert, TablesUpdate } from '../../types/database';
import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import { eq } from '../../lib/utils/filters';

export class EngineNoteRepository extends BaseRepository<'notes'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'notes', { softDelete: true });
  }

  async findByUserAndBook(userId: string, bookId: string): Promise<Tables<'notes'>[]> {
    return this.findMany({
      filters: { conditions: [eq('user_id', userId), eq('book_id', bookId)], match: 'all' },
      sort: { sortBy: 'created_at', sortDirection: 'desc' },
    });
  }

  async createNote(payload: TablesInsert<'notes'>): Promise<Tables<'notes'>> {
    return this.create(payload);
  }

  async updateNote(id: string, payload: TablesUpdate<'notes'>): Promise<Tables<'notes'>> {
    return this.update(id, payload);
  }

  async softDeleteNote(id: string): Promise<void> {
    await this.softDelete(id);
  }
}

export function createEngineNoteRepository(client: TypedSupabaseClient): EngineNoteRepository {
  return new EngineNoteRepository(client);
}
