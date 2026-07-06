import type { Book } from '../../types/database';
import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import { eq, ilike } from '../../lib/utils/filters';
import type { AuthorBookListFilters } from '../types/book.types';

export class AuthorBookRepository extends BaseRepository<'books'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'books', { softDelete: true });
  }

  async findByAuthor(authorId: string, filters: AuthorBookListFilters = {}): Promise<Book[]> {
    const conditions = [eq('author_id', authorId)];
    if (filters.workflowStatus) conditions.push(eq('workflow_status', filters.workflowStatus));
    if (filters.seriesId) conditions.push(eq('series_id', filters.seriesId));
    if (filters.search) conditions.push(ilike('title', filters.search));

    return this.findMany({
      filters: { conditions, match: 'all' },
      sort: { sortBy: 'updated_at', sortDirection: 'desc' },
    });
  }

  async countByAuthor(authorId: string, workflowStatus?: string): Promise<number> {
    const conditions = [eq('author_id', authorId)];
    if (workflowStatus) conditions.push(eq('workflow_status', workflowStatus));
    const rows = await this.findMany({ filters: { conditions, match: 'all' } });
    return rows.length;
  }
}

export function createAuthorBookRepository(client: TypedSupabaseClient): AuthorBookRepository {
  return new AuthorBookRepository(client);
}
