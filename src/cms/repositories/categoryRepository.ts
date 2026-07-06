import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import type { Category, TablesInsert, TablesUpdate } from '../../types/database';
import { eq, ilike, isNull } from '../../lib/utils/filters';
import type { CategoryListFilters } from '../types/category.types';

export class CmsCategoryRepository extends BaseRepository<'categories'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'categories', { softDelete: true });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const rows = await this.findMany({
      filters: { conditions: [eq('slug', slug)], match: 'all' },
      pagination: { page: 1, pageSize: 1 },
    });
    return rows[0] ?? null;
  }

  async findByFilters(filters: CategoryListFilters = {}) {
    const conditions = [];
    if (filters.parentId !== undefined) {
      conditions.push(filters.parentId ? eq('parent_id', filters.parentId) : isNull('parent_id'));
    } else if (filters.rootOnly) {
      conditions.push(isNull('parent_id'));
    }
    if (filters.isActive !== undefined) conditions.push(eq('is_active', filters.isActive));
    if (filters.search) conditions.push(ilike('name', filters.search));

    return this.findMany({
      filters: conditions.length ? { conditions, match: 'all' } : undefined,
      sort: { sortBy: 'sort_order', sortDirection: 'asc' },
    });
  }

  async findChildren(parentId: string): Promise<Category[]> {
    return this.findMany({
      filters: { conditions: [eq('parent_id', parentId)], match: 'all' },
      sort: { sortBy: 'sort_order', sortDirection: 'asc' },
    });
  }

  async insertCategory(payload: TablesInsert<'categories'>): Promise<Category> {
    return this.create(payload);
  }

  async patchCategory(id: string, payload: TablesUpdate<'categories'>): Promise<Category> {
    return this.update(id, payload);
  }

  async getAllSlugs(): Promise<string[]> {
    const rows = await this.findMany({ select: 'slug' });
    return rows.map((r) => r.slug);
  }
}

export function createCmsCategoryRepository(client: TypedSupabaseClient): CmsCategoryRepository {
  return new CmsCategoryRepository(client);
}
