import type { PeopleQueryInput } from '../schemas/people.schemas';

export const peopleQueryKeys = {
  all: ['super-admin', 'people-module'] as const,
  lists: () => [...peopleQueryKeys.all, 'list'] as const,
  list: (params: PeopleQueryInput) => [...peopleQueryKeys.lists(), params] as const,
  stats: () => [...peopleQueryKeys.all, 'stats'] as const,
  filters: () => [...peopleQueryKeys.all, 'filters'] as const,
  details: () => [...peopleQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...peopleQueryKeys.details(), id] as const,
};

export function serializePeopleQueryKey(params: PeopleQueryInput): PeopleQueryInput {
  return {
    search: params.search ?? '',
    role: params.role ?? '',
    status: params.status ?? '',
    verification: params.verification ?? '',
    country: params.country ?? '',
    dateFrom: params.dateFrom ?? '',
    dateTo: params.dateTo ?? '',
    sort: params.sort ?? 'newest',
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 10,
  };
}
