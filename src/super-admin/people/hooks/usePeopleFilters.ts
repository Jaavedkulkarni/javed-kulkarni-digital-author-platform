import { useQuery } from '@tanstack/react-query';
import { PEOPLE_FILTERS_STALE_TIME_MS } from '../constants/people.constants';
import { peopleQueryKeys } from '../queries/people.queries';
import { getPeopleService } from '../services/people.service';
import type { PeopleFilterOptions } from '../types/people.types';

const peopleService = getPeopleService();

export function usePeopleFilters() {
  return useQuery({
    queryKey: peopleQueryKeys.filters(),
    queryFn: async (): Promise<PeopleFilterOptions> => {
      const result = await peopleService.getFilters();
      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Failed to load people filters');
      }
      return result.data;
    },
    staleTime: PEOPLE_FILTERS_STALE_TIME_MS,
  });
}
