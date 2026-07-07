import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PEOPLE_QUERY_STALE_TIME_MS } from '../constants/people.constants';
import { peopleQueryKeys, serializePeopleQueryKey } from '../queries/people.queries';
import type { PeopleQueryInput } from '../schemas/people.schemas';
import { getPeopleService } from '../services/people.service';
import type { PeopleListResult } from '../types/people.types';

const peopleService = getPeopleService();

export function usePeople(query: PeopleQueryInput) {
  const normalized = serializePeopleQueryKey(query);

  return useQuery({
    queryKey: peopleQueryKeys.list(normalized),
    queryFn: async (): Promise<PeopleListResult> => {
      const result = await peopleService.list(normalized);
      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Failed to load people');
      }
      return result.data;
    },
    staleTime: PEOPLE_QUERY_STALE_TIME_MS,
  });
}

export function useInvalidatePeople() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: peopleQueryKeys.all }),
    invalidateLists: () => queryClient.invalidateQueries({ queryKey: peopleQueryKeys.lists() }),
    invalidateStats: () => queryClient.invalidateQueries({ queryKey: peopleQueryKeys.stats() }),
    invalidateFilters: () => queryClient.invalidateQueries({ queryKey: peopleQueryKeys.filters() }),
    invalidateEverything: () => {
      void queryClient.invalidateQueries({ queryKey: peopleQueryKeys.all });
    },
  };
}
