import type { Database, TableName, Tables, TablesInsert, TablesUpdate } from '../../types/database';
import type { TypedSupabaseClient } from '../supabase/clients/browser';
import { checkSupabaseConnection } from '../utils/healthCheck';
import { logger } from '../utils/logger';
import {
  createQueryBuilder,
  deleteRow,
  insertRow,
  softDeleteRow,
  updateRow,
  type QueryOptions,
} from './queryBuilder';
import type { PaginatedResult, PaginationInput } from '../utils/pagination';
import type { FilterGroup } from '../utils/filters';
import type { SortInput } from '../utils/sorting';

export interface ListParams {
  filters?: FilterGroup;
  sort?: SortInput;
  pagination?: PaginationInput;
  select?: string;
}

export class DatabaseService {
  constructor(private readonly client: TypedSupabaseClient) {}

  getClient(): TypedSupabaseClient {
    return this.client;
  }

  from<T extends TableName>(table: T) {
    return this.client.from(table);
  }

  query<T extends TableName>(table: T, options?: QueryOptions) {
    return createQueryBuilder(this.client, table, options);
  }

  async findById<T extends TableName>(
    table: T,
    id: string,
    select = '*'
  ): Promise<Tables<T> | null> {
    return createQueryBuilder(this.client, table, {
      select,
      filters: { conditions: [{ column: 'id', operator: 'eq', value: id }], match: 'all' },
      maybeSingle: true,
    }).executeOne();
  }

  async list<T extends TableName>(
    table: T,
    params: ListParams = {}
  ): Promise<Tables<T>[]> {
    const result = await createQueryBuilder(this.client, table, {
      select: params.select,
      filters: params.filters,
      sort: params.sort,
      pagination: params.pagination,
      count: true,
    }).execute();

    return result.data;
  }

  async listPaginated<T extends TableName>(
    table: T,
    params: ListParams & { pagination: PaginationInput }
  ): Promise<PaginatedResult<Tables<T>>> {
    return createQueryBuilder(this.client, table, {
      select: params.select,
      filters: params.filters,
      sort: params.sort,
      count: true,
    }).executePaginated(params.pagination);
  }

  async create<T extends TableName>(
    table: T,
    payload: TablesInsert<T>,
    select = '*'
  ): Promise<Tables<T>> {
    return insertRow(this.client, table, payload, select);
  }

  async update<T extends TableName>(
    table: T,
    id: string,
    payload: TablesUpdate<T>,
    select = '*'
  ): Promise<Tables<T>> {
    return updateRow(this.client, table, id, payload, 'id', select);
  }

  async remove<T extends TableName>(table: T, id: string): Promise<void> {
    return deleteRow(this.client, table, id);
  }

  async softRemove<T extends TableName>(table: T, id: string): Promise<Tables<T>> {
    return softDeleteRow(this.client, table, id);
  }

  async healthCheck() {
    return checkSupabaseConnection(this.client);
  }

  async rpc<T = unknown>(fn: string, args?: Record<string, unknown>): Promise<T> {
    const result = await this.client.rpc(fn as never, args as never);

    if (result.error) {
      logger.error('database', `RPC ${fn} failed: ${result.error.message}`);
      throw result.error;
    }

    return result.data as T;
  }
}

let databaseService: DatabaseService | null = null;

export function createDatabaseService(client: TypedSupabaseClient): DatabaseService {
  return new DatabaseService(client);
}

export function getDatabaseService(client: TypedSupabaseClient): DatabaseService {
  if (!databaseService) {
    databaseService = createDatabaseService(client);
  }
  return databaseService;
}

export type TypedDatabase = Database;
