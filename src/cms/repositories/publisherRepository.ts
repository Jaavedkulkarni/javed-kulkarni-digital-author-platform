import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import type { Tables, TablesInsert, TablesUpdate } from '../../types/database';
import { eq, ilike } from '../../lib/utils/filters';
import type { PublisherListFilters } from '../types/publisher.types';

export class CmsPublisherRepository extends BaseRepository<'publishers'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'publishers', { softDelete: true });
  }

  async findBySlug(slug: string): Promise<Tables<'publishers'> | null> {
    const rows = await this.findMany({
      filters: { conditions: [eq('slug', slug)], match: 'all' },
      pagination: { page: 1, pageSize: 1 },
    });
    return rows[0] ?? null;
  }

  async findByFilters(filters: PublisherListFilters = {}) {
    const conditions = [];
    if (filters.isVerified !== undefined) conditions.push(eq('is_verified', filters.isVerified));
    if (filters.status) conditions.push(eq('status', filters.status));
    if (filters.search) conditions.push(ilike('name', filters.search));

    return this.findMany({
      filters: conditions.length ? { conditions, match: 'all' } : undefined,
      sort: { sortBy: 'name', sortDirection: 'asc' },
    });
  }

  async insertPublisher(payload: TablesInsert<'publishers'>): Promise<Tables<'publishers'>> {
    return this.create(payload);
  }

  async patchPublisher(id: string, payload: TablesUpdate<'publishers'>): Promise<Tables<'publishers'>> {
    return this.update(id, payload);
  }

  async getAllSlugs(): Promise<string[]> {
    const rows = await this.findMany({ select: 'slug' });
    return rows.map((r) => r.slug);
  }
}

export function createCmsPublisherRepository(client: TypedSupabaseClient): CmsPublisherRepository {
  return new CmsPublisherRepository(client);
}
