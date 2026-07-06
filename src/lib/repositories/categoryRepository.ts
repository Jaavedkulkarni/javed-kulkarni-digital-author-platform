import type { Category } from '../../types/database';
import type { TypedSupabaseClient } from '../supabase/clients/browser';
import { BaseRepository } from './baseRepository';
import { eq } from '../utils/filters';

export class CategoryRepository extends BaseRepository<'categories'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'categories', { softDelete: true });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.findMany({
      filters: { conditions: [eq('slug', slug)], match: 'all' },
      pagination: { page: 1, pageSize: 1 },
    }).then((rows) => rows[0] ?? null);
  }

  async findActive(): Promise<Category[]> {
    return this.findMany({
      filters: {
        conditions: [eq('is_active', true)],
        match: 'all',
      },
      sort: { sortBy: 'sort_order', sortDirection: 'asc' },
    });
  }
}

export function createCategoryRepository(client: TypedSupabaseClient): CategoryRepository {
  return new CategoryRepository(client);
}
