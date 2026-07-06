import type { ListParams } from '../database/databaseService';
import type { Book, TablesInsert, TablesUpdate } from '../../types/database';
import type { TypedSupabaseClient } from '../supabase/clients/browser';
import { BaseRepository } from './baseRepository';
import { eq } from '../utils/filters';

export class BookRepository extends BaseRepository<'books'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'books', { softDelete: true });
  }

  async findBySlug(slug: string): Promise<Book | null> {
    return this.findMany({
      filters: { conditions: [eq('slug', slug)], match: 'all' },
      pagination: { page: 1, pageSize: 1 },
    }).then((rows) => rows[0] ?? null);
  }

  async findPublished(params: Omit<ListParams, 'filters'> = {}): Promise<Book[]> {
    return this.findMany({
      ...params,
      filters: {
        conditions: [eq('workflow_status', 'published')],
        match: 'all',
      },
    });
  }

  async createBook(payload: TablesInsert<'books'>): Promise<Book> {
    return this.create(payload);
  }

  async updateBook(id: string, payload: TablesUpdate<'books'>): Promise<Book> {
    return this.update(id, payload);
  }
}

export function createBookRepository(client: TypedSupabaseClient): BookRepository {
  return new BookRepository(client);
}
