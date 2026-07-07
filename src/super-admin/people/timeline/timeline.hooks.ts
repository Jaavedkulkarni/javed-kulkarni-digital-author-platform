import { useInfiniteQuery } from '@tanstack/react-query';
import type {
  AuditTimelineItem,
  LoginHistoryItem,
  SecurityEventItem,
  TimelineFilters,
  TimelinePage,
} from '../../../enterprise/timeline';
import type { ActivityTimelineEvent } from '../../../enterprise/activity/activity-grouping';
import { PEOPLE_QUERY_STALE_TIME_MS } from '../constants/people.constants';
import { TIMELINE_PAGE_SIZE } from './timeline.constants';
import { getPeopleTimelineService } from './timeline.service';

export const peopleTimelineQueryKeys = {
  audit: (userId: string, filters: TimelineFilters) =>
    ['super-admin', 'people-module', 'audit', userId, filters] as const,
  loginHistory: (userId: string, filters: TimelineFilters) =>
    ['super-admin', 'people-module', 'login-history', userId, filters] as const,
  securityEvents: (userId: string, filters: TimelineFilters) =>
    ['super-admin', 'people-module', 'security-events', userId, filters] as const,
  activity: (userId: string, filters: TimelineFilters) =>
    ['super-admin', 'people-module', 'activity', userId, filters] as const,
};

export const peopleActivityQueryKeys = {
  user: (userId: string) => peopleTimelineQueryKeys.activity(userId, {}),
};

function serializeTimelineFilters(filters: TimelineFilters): TimelineFilters {
  return {
    search: filters.search ?? '',
    severity: filters.severity ?? '',
    action: filters.action ?? '',
    eventType: filters.eventType ?? '',
    dateFrom: filters.dateFrom ?? '',
    dateTo: filters.dateTo ?? '',
  };
}

const timelineService = getPeopleTimelineService();

export function usePeopleAuditTimeline(userId: string | null, filters: TimelineFilters, enabled = true) {
  const normalized = serializeTimelineFilters(filters);
  return useInfiniteQuery({
    queryKey: userId ? peopleTimelineQueryKeys.audit(userId, normalized) : peopleTimelineQueryKeys.audit('', normalized),
    queryFn: async ({ pageParam }): Promise<TimelinePage<AuditTimelineItem>> => {
      if (!userId) throw new Error('User id is required');
      return timelineService.fetchAuditPage({
        userId,
        cursor: pageParam ?? null,
        limit: TIMELINE_PAGE_SIZE,
        ...normalized,
      });
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: Boolean(userId) && enabled,
    staleTime: PEOPLE_QUERY_STALE_TIME_MS,
  });
}

export function usePeopleLoginHistory(userId: string | null, filters: TimelineFilters, enabled = true) {
  const normalized = serializeTimelineFilters(filters);
  return useInfiniteQuery({
    queryKey: userId
      ? peopleTimelineQueryKeys.loginHistory(userId, normalized)
      : peopleTimelineQueryKeys.loginHistory('', normalized),
    queryFn: async ({ pageParam }): Promise<TimelinePage<LoginHistoryItem>> => {
      if (!userId) throw new Error('User id is required');
      return timelineService.fetchLoginHistoryPage({
        userId,
        cursor: pageParam ?? null,
        limit: TIMELINE_PAGE_SIZE,
        ...normalized,
      });
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: Boolean(userId) && enabled,
    staleTime: PEOPLE_QUERY_STALE_TIME_MS,
  });
}

export function usePeopleSecurityEvents(userId: string | null, filters: TimelineFilters, enabled = true) {
  const normalized = serializeTimelineFilters(filters);
  return useInfiniteQuery({
    queryKey: userId
      ? peopleTimelineQueryKeys.securityEvents(userId, normalized)
      : peopleTimelineQueryKeys.securityEvents('', normalized),
    queryFn: async ({ pageParam }): Promise<TimelinePage<SecurityEventItem>> => {
      if (!userId) throw new Error('User id is required');
      return timelineService.fetchSecurityEventsPage({
        userId,
        cursor: pageParam ?? null,
        limit: TIMELINE_PAGE_SIZE,
        ...normalized,
      });
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: Boolean(userId) && enabled,
    staleTime: PEOPLE_QUERY_STALE_TIME_MS,
  });
}

export function usePeopleActivityTimeline(userId: string | null, filters: TimelineFilters, enabled = true) {
  const normalized = serializeTimelineFilters(filters);
  return useInfiniteQuery({
    queryKey: userId
      ? peopleTimelineQueryKeys.activity(userId, normalized)
      : peopleTimelineQueryKeys.activity('', normalized),
    queryFn: async ({ pageParam }): Promise<TimelinePage<ActivityTimelineEvent>> => {
      if (!userId) throw new Error('User id is required');
      return timelineService.fetchActivityPage({
        userId,
        cursor: pageParam ?? null,
        limit: TIMELINE_PAGE_SIZE,
        ...normalized,
      });
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: Boolean(userId) && enabled,
    staleTime: PEOPLE_QUERY_STALE_TIME_MS,
  });
}