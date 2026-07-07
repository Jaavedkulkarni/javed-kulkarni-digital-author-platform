import type { TypedSupabaseClient } from '../../../lib/supabase/clients/browser';
import { getPaginationRange, normalizePage, normalizePageSize } from '../../../lib/utils/pagination';
import { normalizeSupabaseError } from '../../../lib/utils/errors';
import {
  COUNTRY_TIMEZONE_PREFIXES,
  PEOPLE_EDIT_PROFILE_SELECT,
  PEOPLE_PROFILE_SELECT,
  PEOPLE_STATUS_FILTER_OPTIONS,
  PEOPLE_VERIFICATION_FILTER_OPTIONS,
  TIMEZONE_COUNTRY_MAP,
} from '../constants/people.constants';
import { PeopleRepositoryError } from '../errors/people.errors';
import type {
  EditUserDetail,
  PeopleFilterOptions,
  PeopleListResult,
  PeopleQueryParams,
  PeopleEditRepositoryRow,
  PeopleRepositoryRow,
  PeopleStatistics,
  PeopleUser,
} from '../types/people.types';
import { mapEditUserDetail, mapPeopleRepositoryRow } from '../utils/people.mapper';
import { peopleLog } from '../utils/people.logger';
import type { PeopleQueryInput } from '../schemas/people.schemas';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProfileQuery = any;

export class PeopleRepository {
  constructor(private readonly client: TypedSupabaseClient) {}

  async findAll(params: PeopleQueryInput): Promise<PeopleListResult> {
    peopleLog('Repository', 'findAll', params);
    return this.queryPeople(params);
  }

  async findById(id: string): Promise<PeopleUser | null> {
    peopleLog('Repository', 'findById', { id });

    try {
      const { data, error } = await this.client
        .from('profiles')
        .select(PEOPLE_PROFILE_SELECT)
        .eq('id', id)
        .is('deleted_at', null)
        .maybeSingle();

      if (error) {
        throw new PeopleRepositoryError('query_failed', error.message, error);
      }

      if (!data) return null;
      return mapPeopleRepositoryRow(data as unknown as PeopleRepositoryRow);
    } catch (error) {
      if (error instanceof PeopleRepositoryError) throw error;
      throw new PeopleRepositoryError(
        'query_failed',
        normalizeSupabaseError(error, 'database').message,
        error,
      );
    }
  }

  async findEditDetailById(id: string): Promise<EditUserDetail | null> {
    peopleLog('Repository', 'findEditDetailById', { id });

    try {
      const [{ data, error }, { data: securityRow, error: securityError }] = await Promise.all([
        this.client
          .from('profiles')
          .select(PEOPLE_EDIT_PROFILE_SELECT)
          .eq('id', id)
          .is('deleted_at', null)
          .maybeSingle(),
        this.client.from('user_security').select('metadata').eq('user_id', id).maybeSingle(),
      ]);

      if (error) {
        throw new PeopleRepositoryError('query_failed', error.message, error);
      }

      if (securityError && securityError.code !== 'PGRST116') {
        peopleLog('Repository', 'findEditDetailById security read skipped', securityError.message);
      }

      if (!data) return null;

      const metadata = (securityRow?.metadata as { internal_notes?: string } | null) ?? null;
      return mapEditUserDetail(data as unknown as PeopleEditRepositoryRow, metadata?.internal_notes ?? '');
    } catch (error) {
      if (error instanceof PeopleRepositoryError) throw error;
      throw new PeopleRepositoryError(
        'query_failed',
        normalizeSupabaseError(error, 'database').message,
        error,
      );
    }
  }

  async search(params: PeopleQueryInput): Promise<PeopleListResult> {
    peopleLog('Repository', 'search', params);
    return this.queryPeople(params);
  }

  async findAllIds(params: PeopleQueryInput): Promise<string[]> {
    peopleLog('Repository', 'findAllIds', params);

    try {
      const roleUserIds = params.role ? await this.findUserIdsForRole(params.role) : null;
      if (roleUserIds && roleUserIds.length === 0) return [];

      let query = this.client.from('profiles').select('id');

      if (params.status === 'deleted') {
        query = query.not('deleted_at', 'is', null);
      } else {
        query = query.is('deleted_at', null);
      }

      query = this.applySearchFilter(query, params.search);
      query = this.applyStatusFilter(query, params.status);
      query = this.applyVerificationFilter(query, params.verification);
      query = this.applyCountryFilter(query, params.country);
      query = this.applyDateRangeFilter(query, params.dateFrom, params.dateTo);

      if (roleUserIds) {
        query = query.in('id', roleUserIds);
      }

      const { data, error } = await query.limit(5000);
      if (error) throw new PeopleRepositoryError('query_failed', error.message, error);
      return (data ?? []).map((row) => row.id as string);
    } catch (error) {
      if (error instanceof PeopleRepositoryError) throw error;
      throw new PeopleRepositoryError(
        'query_failed',
        normalizeSupabaseError(error, 'database').message,
        error,
      );
    }
  }

  async getStatistics(): Promise<PeopleStatistics> {
    peopleLog('Repository', 'getStatistics');

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sinceIso = thirtyDaysAgo.toISOString();

    try {
      const countFor = async (apply?: (query: ProfileQuery) => ProfileQuery) => {
        let query: ProfileQuery = this.client
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .is('deleted_at', null);

        if (apply) query = apply(query);

        const { count, error } = await query;
        if (error) throw error;
        return count ?? 0;
      };

      const [totalUsers, activeUsers, pendingUsers, suspendedUsers, verifiedUsers, newUsers30Days] =
        await Promise.all([
          countFor(),
          countFor((q) => q.eq('status', 'active')),
          countFor((q) => q.eq('status', 'pending')),
          countFor((q) => q.eq('status', 'suspended')),
          countFor((q) => q.neq('status', 'pending')),
          countFor((q) => q.gte('created_at', sinceIso)),
        ]);

      return {
        totalUsers,
        activeUsers,
        pendingUsers,
        suspendedUsers,
        verifiedUsers,
        newUsers30Days,
      };
    } catch (error) {
      throw new PeopleRepositoryError(
        'statistics_failed',
        error instanceof Error ? error.message : 'Failed to load statistics',
        error,
      );
    }
  }

  async getFilters(): Promise<PeopleFilterOptions> {
    peopleLog('Repository', 'getFilters');

    try {
      const [{ data: roles, error: rolesError }, { data: timezoneRows, error: timezoneError }] =
        await Promise.all([
          this.client.from('roles').select('name, slug').order('name'),
          this.client
            .from('profiles')
            .select('timezone')
            .is('deleted_at', null)
            .not('timezone', 'is', null),
        ]);

      if (rolesError) throw rolesError;
      if (timezoneError) throw timezoneError;

      const roleOptions = [
        { value: '', label: 'All roles' },
        ...(roles ?? []).map((role) => ({
          value: role.name,
          label: role.name
            .split('_')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' '),
        })),
      ];

      const countrySet = new Set<string>();
      for (const row of timezoneRows ?? []) {
        const timezone = row.timezone as string | null;
        if (!timezone) continue;
        const country = TIMEZONE_COUNTRY_MAP[timezone];
        if (country) countrySet.add(country);
      }

      const countries = [
        { value: '', label: 'All countries' },
        ...Array.from(countrySet)
          .sort((a, b) => a.localeCompare(b))
          .map((country) => ({ value: country, label: country })),
      ];

      return {
        roles: roleOptions,
        statuses: PEOPLE_STATUS_FILTER_OPTIONS.map((option) => ({ ...option })),
        verification: PEOPLE_VERIFICATION_FILTER_OPTIONS.map((option) => ({ ...option })),
        countries,
      };
    } catch (error) {
      throw new PeopleRepositoryError(
        'filters_failed',
        error instanceof Error ? error.message : 'Failed to load filters',
        error,
      );
    }
  }

  private async queryPeople(params: PeopleQueryInput): Promise<PeopleListResult> {
    const page = normalizePage(params.page);
    const pageSize = normalizePageSize(params.pageSize);
    const { from, to } = getPaginationRange({ page, pageSize });

    try {
      const roleUserIds = params.role ? await this.findUserIdsForRole(params.role) : null;
      if (roleUserIds && roleUserIds.length === 0) {
        return { items: [], page, pageSize, total: 0, totalPages: 0 };
      }

      let query = this.client
        .from('profiles')
        .select(PEOPLE_PROFILE_SELECT, { count: 'exact' });

      if (params.status === 'deleted') {
        query = query.not('deleted_at', 'is', null);
      } else {
        query = query.is('deleted_at', null);
      }

      query = this.applySearchFilter(query, params.search);
      query = this.applyStatusFilter(query, params.status);
      query = this.applyVerificationFilter(query, params.verification);
      query = this.applyCountryFilter(query, params.country);
      query = this.applyDateRangeFilter(query, params.dateFrom, params.dateTo);

      if (roleUserIds) {
        query = query.in('id', roleUserIds);
      }

      query = this.applySort(query, params.sort);

      const { data, error, count } = await query.range(from, to);

      if (error) {
        throw new PeopleRepositoryError('query_failed', error.message, error);
      }

      const total = count ?? 0;
      const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
      const items = (data ?? []).map((row) => mapPeopleRepositoryRow(row as unknown as PeopleRepositoryRow));

      return { items, page, pageSize, total, totalPages };
    } catch (error) {
      if (error instanceof PeopleRepositoryError) throw error;
      throw new PeopleRepositoryError(
        'query_failed',
        normalizeSupabaseError(error, 'database').message,
        error,
      );
    }
  }

  private async findUserIdsForRole(roleName: string): Promise<string[]> {
    const { data: role, error: roleError } = await this.client
      .from('roles')
      .select('id')
      .eq('name', roleName)
      .maybeSingle();

    if (roleError) {
      throw new PeopleRepositoryError('query_failed', roleError.message, roleError);
    }
    if (!role) return [];

    const { data, error } = await this.client
      .from('user_roles')
      .select('user_id')
      .eq('role_id', role.id)
      .eq('is_active', true);

    if (error) {
      throw new PeopleRepositoryError('query_failed', error.message, error);
    }

    return (data ?? []).map((row) => row.user_id);
  }

  private applySearchFilter(query: ProfileQuery, search?: string): ProfileQuery {
    const term = search?.trim();
    if (!term) return query;

    if (UUID_PATTERN.test(term)) {
      return query.eq('id', term) as ProfileQuery;
    }

    const escaped = term.replace(/[%_]/g, '\\$&');
    return query.or(
      `full_name.ilike.%${escaped}%,email.ilike.%${escaped}%,phone.ilike.%${escaped}%`,
    ) as ProfileQuery;
  }

  private applyStatusFilter(query: ProfileQuery, status?: string): ProfileQuery {
    if (!status || status === 'deleted') return query;
    return query.eq('status', status) as ProfileQuery;
  }

  private applyVerificationFilter(query: ProfileQuery, verification?: string): ProfileQuery {
    if (!verification) return query;

    switch (verification) {
      case 'verified':
        return query.neq('status', 'pending') as ProfileQuery;
      case 'pending':
        return query.eq('status', 'pending') as ProfileQuery;
      case 'unverified':
        return query.in('status', ['pending']) as ProfileQuery;
      default:
        return query;
    }
  }

  private applyCountryFilter(query: ProfileQuery, country?: string): ProfileQuery {
    if (!country) return query;

    const prefixes = COUNTRY_TIMEZONE_PREFIXES[country];
    if (!prefixes || prefixes.length === 0) return query;

    if (prefixes.length === 1 && !prefixes[0].endsWith('/')) {
      return query.eq('timezone', prefixes[0]) as ProfileQuery;
    }

    const orExpression = prefixes
      .map((prefix) =>
        prefix.endsWith('/') ? `timezone.ilike.${prefix}%` : `timezone.eq.${prefix}`,
      )
      .join(',');

    return query.or(orExpression) as ProfileQuery;
  }

  private applyDateRangeFilter(
    query: ProfileQuery,
    dateFrom?: string,
    dateTo?: string,
  ): ProfileQuery {
    let next = query;
    if (dateFrom) {
      next = next.gte('created_at', `${dateFrom}T00:00:00.000Z`) as ProfileQuery;
    }
    if (dateTo) {
      next = next.lte('created_at', `${dateTo}T23:59:59.999Z`) as ProfileQuery;
    }
    return next;
  }

  private applySort(query: ProfileQuery, sort: PeopleQueryParams['sort']): ProfileQuery {
    switch (sort) {
      case 'oldest':
        return query.order('created_at', { ascending: true }) as ProfileQuery;
      case 'name':
        return query.order('full_name', { ascending: true, nullsFirst: false }) as ProfileQuery;
      case 'last_login':
        return query.order('updated_at', { ascending: false }) as ProfileQuery;
      case 'role':
        return query.order('full_name', { ascending: true, nullsFirst: false }) as ProfileQuery;
      case 'newest':
      default:
        return query.order('created_at', { ascending: false }) as ProfileQuery;
    }
  }
}

export function createPeopleRepository(client: TypedSupabaseClient): PeopleRepository {
  return new PeopleRepository(client);
}
