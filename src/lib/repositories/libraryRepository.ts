import type { LibraryItem, TablesInsert, TablesUpdate } from '../../types/database';
import type { TypedSupabaseClient } from '../supabase/clients/browser';
import { BaseRepository } from './baseRepository';
import { eq } from '../utils/filters';

export class LibraryRepository extends BaseRepository<'library'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'library', { softDelete: true });
  }

  async findByUser(userId: string): Promise<LibraryItem[]> {
    return this.findMany({
      filters: { conditions: [eq('user_id', userId)], match: 'all' },
      sort: { sortBy: 'last_opened_at', sortDirection: 'desc' },
    });
  }

  async findByUserAndBook(userId: string, bookId: string): Promise<LibraryItem | null> {
    return this.findMany({
      filters: {
        conditions: [eq('user_id', userId), eq('book_id', bookId)],
        match: 'all',
      },
      pagination: { page: 1, pageSize: 1 },
    }).then((rows) => rows[0] ?? null);
  }

  async addToLibrary(payload: TablesInsert<'library'>): Promise<LibraryItem> {
    return this.create(payload);
  }

  async updateLibraryItem(id: string, payload: TablesUpdate<'library'>): Promise<LibraryItem> {
    return this.update(id, payload);
  }
}

export function createLibraryRepository(client: TypedSupabaseClient): LibraryRepository {
  return new LibraryRepository(client);
}
