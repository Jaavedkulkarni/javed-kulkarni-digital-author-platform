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

export function usePeopleUserDetail(userId: string | null, enabled = true) {
  return useQuery({
    queryKey: userId ? peopleQueryKeys.detail(userId) : peopleQueryKeys.details(),
    queryFn: async () => {
      if (!userId) throw new Error('User id is required');
      const result = await peopleService.getEditDetailById(userId);
      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Failed to load user details');
      }
      return result.data;
    },
    enabled: Boolean(userId) && enabled,
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
    invalidateDetail: (userId: string) =>
      queryClient.invalidateQueries({ queryKey: peopleQueryKeys.detail(userId) }),
    invalidateActivity: (userId: string) =>
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'people-module', 'activity', userId] }),
    invalidateAudit: (userId: string) =>
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'people-module', 'audit', userId] }),
    invalidateLoginHistory: (userId: string) =>
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'people-module', 'login-history', userId] }),
    invalidateSecurityEvents: (userId: string) =>
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'people-module', 'security-events', userId] }),
    invalidateTimelines: (userId: string) => {
      void queryClient.invalidateQueries({ queryKey: ['super-admin', 'people-module', 'activity', userId] });
      void queryClient.invalidateQueries({ queryKey: ['super-admin', 'people-module', 'audit', userId] });
      void queryClient.invalidateQueries({ queryKey: ['super-admin', 'people-module', 'login-history', userId] });
      void queryClient.invalidateQueries({ queryKey: ['super-admin', 'people-module', 'security-events', userId] });
    },
    invalidateSecurity: (userId: string) =>
      queryClient.invalidateQueries({ queryKey: peopleQueryKeys.security(userId) }),
    invalidateSessions: (userId: string) =>
      queryClient.invalidateQueries({ queryKey: peopleQueryKeys.sessions(userId) }),
    invalidateEverything: () => {
      void queryClient.invalidateQueries({ queryKey: peopleQueryKeys.all });
    },
  };
}
