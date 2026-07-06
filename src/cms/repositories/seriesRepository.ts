import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import type { Tables, TablesInsert, TablesUpdate } from '../../types/database';
import { eq, ilike } from '../../lib/utils/filters';
import type { SeriesListFilters } from '../types/series.types';

export class CmsSeriesRepository extends BaseRepository<'series'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'series', { softDelete: true });
  }

  async findBySlug(slug: string): Promise<Tables<'series'> | null> {
    const rows = await this.findMany({
      filters: { conditions: [eq('slug', slug)], match: 'all' },
      pagination: { page: 1, pageSize: 1 },
    });
    return rows[0] ?? null;
  }

  async findByFilters(filters: SeriesListFilters = {}) {
    const conditions = [];
    if (filters.authorId) conditions.push(eq('author_id', filters.authorId));
    if (filters.publisherId) conditions.push(eq('publisher_id', filters.publisherId));
    if (filters.isFeatured !== undefined) conditions.push(eq('is_featured', filters.isFeatured));
    if (filters.search) conditions.push(ilike('title', filters.search));

    return this.findMany({
      filters: conditions.length ? { conditions, match: 'all' } : undefined,
      sort: { sortBy: 'sort_order', sortDirection: 'asc' },
    });
  }

  async insertSeries(payload: TablesInsert<'series'>): Promise<Tables<'series'>> {
    return this.create(payload);
  }

  async patchSeries(id: string, payload: TablesUpdate<'series'>): Promise<Tables<'series'>> {
    return this.update(id, payload);
  }

  async updateBookOrder(seriesId: string, bookId: string, seriesOrder: number) {
    const result = await this.client
      .from('books')
      .update({ series_id: seriesId, series_order: seriesOrder } as never)
      .eq('id', bookId);
    if (result.error) throw result.error;
  }

  async getBooksInSeries(seriesId: string) {
    return this.client
      .from('books')
      .select('id, title, series_order')
      .eq('series_id', seriesId)
      .order('series_order', { ascending: true });
  }

  async getAllSlugs(): Promise<string[]> {
    const rows = await this.findMany({ select: 'slug' });
    return rows.map((r) => r.slug);
  }
}

export function createCmsSeriesRepository(client: TypedSupabaseClient): CmsSeriesRepository {
  return new CmsSeriesRepository(client);
}
