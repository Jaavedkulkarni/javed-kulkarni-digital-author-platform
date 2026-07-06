import type { TableName, Tables, TablesInsert, TablesUpdate } from '../../types/database';
import type { TypedSupabaseClient } from '../supabase/clients/browser';
import { applyFilters, type FilterGroup } from '../utils/filters';
import { applySorting, withDefaultSort, type SortInput } from '../utils/sorting';
import {
  createPaginatedResult,
  getPaginationRange,
  type PaginatedResult,
  type PaginationInput,
} from '../utils/pagination';
import { normalizeSupabaseError } from '../utils/errors';
import { withRetry } from '../utils/retry';
import type { SupabaseQueryBuilder } from '../utils/supabaseQuery';

export interface QueryOptions {
  select?: string;
  filters?: FilterGroup;
  sort?: SortInput;
  pagination?: PaginationInput;
  includeDeleted?: boolean;
  single?: boolean;
  maybeSingle?: boolean;
  count?: boolean;
}

type RowType<T extends TableName> = Tables<T>;
type InsertType<T extends TableName> = TablesInsert<T>;
type UpdateType<T extends TableName> = TablesUpdate<T>;

function asQueryBuilder(query: unknown): SupabaseQueryBuilder {
  return query as SupabaseQueryBuilder;
}

export class QueryBuilder<T extends TableName> {
  constructor(
    private readonly client: TypedSupabaseClient,
    private readonly table: T,
    private readonly options: QueryOptions = {}
  ) {}

  private baseQuery(select = this.options.select ?? '*') {
    const wantsCount = this.options.count ?? false;
    return asQueryBuilder(
      this.client.from(this.table).select(select, {
        count: wantsCount ? 'exact' : undefined,
      })
    );
  }

  build() {
    let query = this.baseQuery();

    if (this.options.filters) {
      query = applyFilters(query, this.options.filters);
    }

    if (this.options.sort) {
      query = applySorting(query, withDefaultSort(this.options.sort));
    }

    if (this.options.pagination) {
      const { from, to } = getPaginationRange(this.options.pagination);
      query = query.range(from, to);
    }

    return query;
  }

  async execute(): Promise<{ data: RowType<T>[]; count: number | null }> {
    const result = await withRetry(async () => this.build());

    if (result.error) {
      throw normalizeSupabaseError(result.error, 'database');
    }

    return {
      data: (result.data ?? []) as RowType<T>[],
      count: result.count,
    };
  }

  async executePaginated(
    pagination: PaginationInput
  ): Promise<PaginatedResult<RowType<T>>> {
    const result = await withRetry(async () => {
      let query = this.baseQuery();

      if (this.options.filters) {
        query = applyFilters(query, this.options.filters);
      }

      if (this.options.sort) {
        query = applySorting(query, withDefaultSort(this.options.sort));
      }

      const { from, to } = getPaginationRange(pagination);
      return query.range(from, to);
    });

    if (result.error) {
      throw normalizeSupabaseError(result.error, 'database');
    }

    return createPaginatedResult(
      (result.data ?? []) as RowType<T>[],
      pagination,
      result.count
    );
  }

  async executeOne(): Promise<RowType<T> | null> {
    const result = await withRetry(async () => {
      let query = this.baseQuery();

      if (this.options.filters) {
        query = applyFilters(query, this.options.filters);
      }

      return this.options.maybeSingle ? query.maybeSingle() : query.single();
    });

    if (result.error) {
      throw normalizeSupabaseError(result.error, 'database');
    }

    return (result.data as RowType<T> | null) ?? null;
  }
}

export function createQueryBuilder<T extends TableName>(
  client: TypedSupabaseClient,
  table: T,
  options?: QueryOptions
): QueryBuilder<T> {
  return new QueryBuilder(client, table, options);
}

export async function insertRow<T extends TableName>(
  client: TypedSupabaseClient,
  table: T,
  payload: InsertType<T>,
  select = '*'
): Promise<RowType<T>> {
  const result = await withRetry(async () =>
    client.from(table).insert(payload as never).select(select).single()
  );

  if (result.error) {
    throw normalizeSupabaseError(result.error, 'database');
  }

  return result.data as unknown as RowType<T>;
}

export async function updateRow<T extends TableName>(
  client: TypedSupabaseClient,
  table: T,
  id: string,
  payload: UpdateType<T>,
  idColumn = 'id',
  select = '*'
): Promise<RowType<T>> {
  const result = await withRetry(async () => {
    const query = client.from(table).update(payload as never).filter(idColumn, 'eq', id);
    return query.select(select).single();
  });

  if (result.error) {
    throw normalizeSupabaseError(result.error, 'database');
  }

  return result.data as unknown as RowType<T>;
}

export async function deleteRow<T extends TableName>(
  client: TypedSupabaseClient,
  table: T,
  id: string,
  idColumn = 'id'
): Promise<void> {
  const result = await withRetry(async () =>
    client.from(table).delete().filter(idColumn, 'eq', id)
  );

  if (result.error) {
    throw normalizeSupabaseError(result.error, 'database');
  }
}

export async function softDeleteRow<T extends TableName>(
  client: TypedSupabaseClient,
  table: T,
  id: string,
  idColumn = 'id',
  deletedAtColumn = 'deleted_at'
): Promise<RowType<T>> {
  const payload = { [deletedAtColumn]: new Date().toISOString() } as UpdateType<T>;
  return updateRow(client, table, id, payload, idColumn);
}
