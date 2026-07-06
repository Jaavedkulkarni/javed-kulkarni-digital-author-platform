import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import type { Tables, TablesInsert, TablesUpdate } from '../../types/database';
import { eq, ilike } from '../../lib/utils/filters';
import type { AuthorListFilters } from '../types/author.types';

export class CmsAuthorRepository extends BaseRepository<'authors'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'authors', { softDelete: true });
  }

  async findBySlug(slug: string): Promise<Tables<'authors'> | null> {
    const rows = await this.findMany({
      filters: { conditions: [eq('slug', slug)], match: 'all' },
      pagination: { page: 1, pageSize: 1 },
    });
    return rows[0] ?? null;
  }

  async findByFilters(filters: AuthorListFilters = {}) {
    const conditions = [];
    if (filters.isVerified !== undefined) conditions.push(eq('is_verified', filters.isVerified));
    if (filters.isFeatured !== undefined) conditions.push(eq('is_featured', filters.isFeatured));
    if (filters.status) conditions.push(eq('status', filters.status));
    if (filters.search) conditions.push(ilike('display_name', filters.search));

    return this.findMany({
      filters: conditions.length ? { conditions, match: 'all' } : undefined,
      sort: { sortBy: 'display_name', sortDirection: 'asc' },
    });
  }

  async insertAuthor(payload: TablesInsert<'authors'>): Promise<Tables<'authors'>> {
    return this.create(payload);
  }

  async patchAuthor(id: string, payload: TablesUpdate<'authors'>): Promise<Tables<'authors'>> {
    return this.update(id, payload);
  }

  async getAllSlugs(): Promise<string[]> {
    const rows = await this.findMany({ select: 'slug' });
    return rows.map((r) => r.slug);
  }
}

export function createCmsAuthorRepository(client: TypedSupabaseClient): CmsAuthorRepository {
  return new CmsAuthorRepository(client);
}
