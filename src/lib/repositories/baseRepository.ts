import type {
  Database,
  TableName,
  Tables,
  TablesInsert,
  TablesUpdate,
} from '../../types/database';
import type { TypedSupabaseClient } from '../supabase/clients/browser';
import { createQueryBuilder } from '../database/queryBuilder';
import type { ListParams } from '../database/databaseService';
import type { PaginatedResult, PaginationInput } from '../utils/pagination';
import { eq, notDeleted, type FilterGroup } from '../utils/filters';

export interface RepositoryOptions {
  softDelete?: boolean;
  deletedAtColumn?: string;
  idColumn?: string;
}

export abstract class BaseRepository<T extends TableName> {
  protected readonly table: T;
  protected readonly softDelete: boolean;
  protected readonly deletedAtColumn: string;
  protected readonly idColumn: string;

  constructor(
    protected readonly client: TypedSupabaseClient,
    table: T,
    options: RepositoryOptions = {}
  ) {
    this.table = table;
    this.softDelete = options.softDelete ?? true;
    this.deletedAtColumn = options.deletedAtColumn ?? 'deleted_at';
    this.idColumn = options.idColumn ?? 'id';
  }

  protected withActiveFilter(filters?: FilterGroup): FilterGroup {
    const baseConditions = filters?.conditions ?? [];

    if (!this.softDelete) {
      return { conditions: baseConditions, match: filters?.match ?? 'all' };
    }

    return {
      conditions: [...baseConditions, notDeleted(this.deletedAtColumn)],
      match: filters?.match ?? 'all',
    };
  }

  async findById(id: string, select = '*'): Promise<Tables<T> | null> {
    return createQueryBuilder(this.client, this.table, {
      select,
      filters: this.withActiveFilter({
        conditions: [eq(this.idColumn, id)],
        match: 'all',
      }),
      maybeSingle: true,
    }).executeOne();
  }

  async findMany(params: ListParams = {}): Promise<Tables<T>[]> {
    const result = await createQueryBuilder(this.client, this.table, {
      select: params.select,
      filters: this.withActiveFilter(params.filters),
      sort: params.sort,
      pagination: params.pagination,
      count: true,
    }).execute();

    return result.data;
  }

  async findManyPaginated(
    pagination: PaginationInput,
    params: Omit<ListParams, 'pagination'> = {}
  ): Promise<PaginatedResult<Tables<T>>> {
    return createQueryBuilder(this.client, this.table, {
      select: params.select,
      filters: this.withActiveFilter(params.filters),
      sort: params.sort,
      count: true,
    }).executePaginated(pagination);
  }

  async create(payload: TablesInsert<T>, select = '*'): Promise<Tables<T>> {
    const result = await this.client
      .from(this.table)
      .insert(payload as never)
      .select(select)
      .single();

    if (result.error) throw result.error;
    return result.data as unknown as Tables<T>;
  }

  async update(id: string, payload: TablesUpdate<T>, select = '*'): Promise<Tables<T>> {
    const result = await this.client
      .from(this.table)
      .update(payload as never)
      .filter(this.idColumn, 'eq', id)
      .select(select)
      .single();

    if (result.error) throw result.error;
    return result.data as unknown as Tables<T>;
  }

  async delete(id: string): Promise<void> {
    if (this.softDelete) {
      await this.update(id, { [this.deletedAtColumn]: new Date().toISOString() } as TablesUpdate<T>);
      return;
    }

    const result = await this.client.from(this.table).delete().filter(this.idColumn, 'eq', id);
    if (result.error) throw result.error;
  }

  async count(filters?: FilterGroup): Promise<number> {
    const result = await createQueryBuilder(this.client, this.table, {
      select: this.idColumn,
      filters: this.withActiveFilter(filters),
      count: true,
    }).execute();

    return result.count ?? 0;
  }
}

export type RepositoryClient = TypedSupabaseClient;

export type { Database };
