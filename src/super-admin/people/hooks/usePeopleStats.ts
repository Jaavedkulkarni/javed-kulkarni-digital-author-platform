import { useQuery } from '@tanstack/react-query';
import { PEOPLE_STATS_STALE_TIME_MS } from '../constants/people.constants';
import { peopleQueryKeys } from '../queries/people.queries';
import { getPeopleService } from '../services/people.service';
import type { PeopleStatistics } from '../types/people.types';

const peopleService = getPeopleService();

export function usePeopleStats() {
  return useQuery({
    queryKey: peopleQueryKeys.stats(),
    queryFn: async (): Promise<PeopleStatistics> => {
      const result = await peopleService.getStatistics();
      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Failed to load people statistics');
      }
      return result.data;
    },
    staleTime: PEOPLE_STATS_STALE_TIME_MS,
  });
}
