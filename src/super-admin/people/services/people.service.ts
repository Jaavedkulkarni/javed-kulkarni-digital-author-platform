import type { TypedSupabaseClient } from '../../../lib/supabase/clients/browser';
import { getBrowserClient } from '../../../lib/supabase/clients/browser';
import { PeopleRepositoryError, PeopleServiceError, toPeopleServiceError } from '../errors/people.errors';
import { createPeopleRepository, PeopleRepository } from '../repositories/people.repository';
import {
  parsePeopleFilterOptions,
  parsePeopleListResult,
  parsePeopleQuery,
  parsePeopleStatistics,
  safeParsePeopleQuery,
  type PeopleQueryInput,
} from '../schemas/people.schemas';
import type {
  EditUserDetail,
  PeopleFilterOptions,
  PeopleListResult,
  PeopleQueryParams,
  PeopleServiceResult,
  PeopleStatistics,
  PeopleUser,
} from '../types/people.types';
import { peopleLog } from '../utils/people.logger';

export class PeopleService {
  constructor(private readonly repository: PeopleRepository) {}

  async list(params: PeopleQueryParams): Promise<PeopleServiceResult<PeopleListResult>> {
    return this.execute(async () => {
      const query = parsePeopleQuery(params);
      peopleLog('Service', 'list', query);
      const result = await this.repository.findAll(query);
      return parsePeopleListResult(result);
    });
  }

  async search(params: PeopleQueryParams): Promise<PeopleServiceResult<PeopleListResult>> {
    return this.execute(async () => {
      const query = parsePeopleQuery(params);
      peopleLog('Service', 'search', query);
      const result = await this.repository.search(query);
      return parsePeopleListResult(result);
    });
  }

  async getById(id: string): Promise<PeopleServiceResult<PeopleUser>> {
    return this.execute(async () => {
      peopleLog('Service', 'getById', { id });
      const user = await this.repository.findById(id);
      if (!user) {
        throw new PeopleRepositoryError('not_found', `User ${id} not found`);
      }
      return user;
    });
  }

  async getEditDetailById(id: string): Promise<PeopleServiceResult<EditUserDetail>> {
    return this.execute(async () => {
      peopleLog('Service', 'getEditDetailById', { id });
      const detail = await this.repository.findEditDetailById(id);
      if (!detail) {
        throw new PeopleRepositoryError('not_found', `User ${id} not found`);
      }
      return detail;
    });
  }

  async getStatistics(): Promise<PeopleServiceResult<PeopleStatistics>> {
    return this.execute(async () => {
      peopleLog('Service', 'getStatistics');
      const stats = await this.repository.getStatistics();
      return parsePeopleStatistics(stats);
    });
  }

  async getFilters(): Promise<PeopleServiceResult<PeopleFilterOptions>> {
    return this.execute(async () => {
      peopleLog('Service', 'getFilters');
      const filters = await this.repository.getFilters();
      return parsePeopleFilterOptions(filters);
    });
  }

  async getAllMatchingIds(params: PeopleQueryParams): Promise<PeopleServiceResult<string[]>> {
    return this.execute(async () => {
      const query = parsePeopleQuery(params);
      peopleLog('Service', 'getAllMatchingIds', query);
      return this.repository.findAllIds(query);
    });
  }

  buildQueryInput(
    filters: Omit<PeopleQueryParams, 'page' | 'pageSize' | 'sort'>,
    pagination: Pick<PeopleQueryParams, 'page' | 'pageSize' | 'sort'>,
  ): PeopleQueryInput | null {
    const parsed = safeParsePeopleQuery({ ...filters, ...pagination });
    if (!parsed.success) {
      peopleLog('Service', 'buildQueryInput validation failed', parsed.error.flatten());
      return null;
    }
    return parsed.data;
  }

  private async execute<T>(operation: () => Promise<T>): Promise<PeopleServiceResult<T>> {
    try {
      const data = await operation();
      return { success: true, data };
    } catch (error) {
      const serviceError = toPeopleServiceError(error);
      peopleLog('Service', 'error', serviceError.message);
      return { success: false, error: serviceError.message };
    }
  }
}

let cachedPeopleService: PeopleService | null = null;

export function createPeopleService(client?: TypedSupabaseClient): PeopleService {
  const resolvedClient = client ?? getBrowserClient();
  return new PeopleService(createPeopleRepository(resolvedClient));
}

export function getPeopleService(): PeopleService {
  if (!cachedPeopleService) {
    cachedPeopleService = createPeopleService();
  }
  return cachedPeopleService;
}

export type { PeopleServiceError };
