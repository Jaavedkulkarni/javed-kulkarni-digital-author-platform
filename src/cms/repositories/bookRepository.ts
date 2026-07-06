import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import type { Book, TablesInsert, TablesUpdate } from '../../types/database';
import { eq, ilike } from '../../lib/utils/filters';
import type { ListParams } from '../../lib/database/databaseService';
import type { BookListFilters } from '../types/book.types';
import type { PaginationInput } from '../../lib/utils/pagination';

export class CmsBookRepository extends BaseRepository<'books'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'books', { softDelete: true });
  }

  async findBySlug(slug: string): Promise<Book | null> {
    const rows = await this.findMany({
      filters: { conditions: [eq('slug', slug)], match: 'all' },
      pagination: { page: 1, pageSize: 1 },
    });
    return rows[0] ?? null;
  }

  async findByFilters(filters: BookListFilters, params: Omit<ListParams, 'filters'> = {}): Promise<Book[]> {
    const conditions = [];

    if (filters.workflowStatus) conditions.push(eq('workflow_status', filters.workflowStatus));
    if (filters.authorId) conditions.push(eq('author_id', filters.authorId));
    if (filters.publisherId) conditions.push(eq('publisher_id', filters.publisherId));
    if (filters.seriesId) conditions.push(eq('series_id', filters.seriesId));
    if (filters.isFeatured !== undefined) conditions.push(eq('is_featured', filters.isFeatured));
    if (filters.search) conditions.push(ilike('title', filters.search));

    return this.findMany({
      ...params,
      filters: conditions.length ? { conditions, match: 'all' } : undefined,
    });
  }

  async findPaginated(filters: BookListFilters, pagination: PaginationInput) {
    const conditions = [];
    if (filters.workflowStatus) conditions.push(eq('workflow_status', filters.workflowStatus));
    if (filters.authorId) conditions.push(eq('author_id', filters.authorId));
    if (filters.search) conditions.push(ilike('title', filters.search));

    return this.findManyPaginated(pagination, {
      filters: conditions.length ? { conditions, match: 'all' } : undefined,
      sort: { sortBy: 'updated_at', sortDirection: 'desc' },
    });
  }

  async insertBook(payload: TablesInsert<'books'>): Promise<Book> {
    return this.create(payload);
  }

  async patchBook(id: string, payload: TablesUpdate<'books'>): Promise<Book> {
    return this.update(id, payload);
  }

  async linkCategory(bookId: string, categoryId: string, isPrimary = false, sortOrder = 0) {
    const result = await this.client.from('book_categories').upsert({
      book_id: bookId,
      category_id: categoryId,
      is_primary: isPrimary,
      sort_order: sortOrder,
    } as never);
    if (result.error) throw result.error;
  }

  async unlinkCategory(bookId: string, categoryId: string) {
    const result = await this.client
      .from('book_categories')
      .delete()
      .eq('book_id', bookId)
      .eq('category_id', categoryId);
    if (result.error) throw result.error;
  }

  async getCategoryIds(bookId: string): Promise<string[]> {
    const result = await this.client
      .from('book_categories')
      .select('category_id')
      .eq('book_id', bookId);

    if (result.error) throw result.error;
    return (result.data ?? []).map((row) => (row as { category_id: string }).category_id);
  }

  async getAllSlugs(): Promise<string[]> {
    const rows = await this.findMany({ select: 'slug' });
    return rows.map((r) => r.slug);
  }
}

export function createCmsBookRepository(client: TypedSupabaseClient): CmsBookRepository {
  return new CmsBookRepository(client);
}
