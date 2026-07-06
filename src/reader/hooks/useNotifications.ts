import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  calculateStatistics,
  DEFAULT_NOTIFICATION_FILTERS,
  hasActiveNotificationFilters,
  processNotifications,
  type NotificationFilters,
  type NotificationSortKey,
} from '../../lib/notificationLogic';
import type { MockNotification } from '../../data/mockNotifications';
import { readerQueryKeys } from '../query/queryKeys';
import {
  archiveNotification,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/notifications.service';
import { useReaderUserId } from './useReaderUserId';
import { useOnlineStatus } from '../utils/offline';
import { EMPTY_NOTIFICATIONS } from '../utils/queryDefaults';

export function useNotifications() {
  const userId = useReaderUserId();
  const isOnline = useOnlineStatus();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<NotificationFilters>(DEFAULT_NOTIFICATION_FILTERS);
  const [sortKey, setSortKey] = useState<NotificationSortKey>('newest');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);

  const query = useQuery({
    queryKey: readerQueryKeys.notifications(userId ?? 'guest'),
    queryFn: () => fetchNotifications(userId!),
    enabled: Boolean(userId) && isOnline,
  });

  const notifications = query.data ?? EMPTY_NOTIFICATIONS;
  const datasetEmpty = !query.isLoading && notifications.length === 0;

  const updateCache = useCallback(
    (updater: (items: MockNotification[]) => MockNotification[]) => {
      if (!userId) return;
      queryClient.setQueryData(readerQueryKeys.notifications(userId), (current: MockNotification[] | undefined) =>
        updater(current ?? [])
      );
    },
    [queryClient, userId]
  );

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onMutate: (notificationId) => {
      updateCache((items) =>
        items.map((notification) =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification
        )
      );
    },
    onSettled: () => {
      if (userId) void queryClient.invalidateQueries({ queryKey: readerQueryKeys.notifications(userId) });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllNotificationsRead(userId!),
    onMutate: () => {
      updateCache((items) => items.map((notification) => ({ ...notification, isRead: true })));
    },
    onSettled: () => {
      if (userId) void queryClient.invalidateQueries({ queryKey: readerQueryKeys.notifications(userId) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: archiveNotification,
    onMutate: (notificationId) => {
      updateCache((items) => items.filter((notification) => notification.id !== notificationId));
      setSelectedNotificationId((current) => (current === notificationId ? null : current));
    },
    onSettled: () => {
      if (userId) void queryClient.invalidateQueries({ queryKey: readerQueryKeys.notifications(userId) });
    },
  });

  const items = useMemo(
    () => processNotifications(notifications, searchQuery, filters, unreadOnly, sortKey),
    [notifications, searchQuery, filters, unreadOnly, sortKey]
  );

  const stats = useMemo(() => calculateStatistics(notifications), [notifications]);

  const filtersActive = useMemo(
    () => hasActiveNotificationFilters(filters, searchQuery, unreadOnly),
    [filters, searchQuery, unreadOnly]
  );

  const hasUnread = stats.unread > 0;
  const allCleared = notifications.length === 0;

  const updateFilter = useCallback(<K extends keyof NotificationFilters>(key: K, value: NotificationFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_NOTIFICATION_FILTERS);
    setUnreadOnly(false);
  }, []);

  const toggleUnreadOnly = useCallback(() => {
    setUnreadOnly((prev) => !prev);
  }, []);

  const selectNotification = useCallback((notificationId: string) => {
    setSelectedNotificationId(notificationId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedNotificationId(null);
  }, []);

  const markRead = useCallback(
    (notificationId: string) => {
      markReadMutation.mutate(notificationId);
    },
    [markReadMutation]
  );

  const markAllRead = useCallback(() => {
    if (!userId) return;
    markAllReadMutation.mutate();
  }, [markAllReadMutation, userId]);

  const deleteNotification = useCallback(
    (notificationId: string) => {
      deleteMutation.mutate(notificationId);
    },
    [deleteMutation]
  );

  return {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    resetFilters,
    sortKey,
    setSortKey,
    unreadOnly,
    toggleUnreadOnly,
    filterOpen,
    setFilterOpen,
    items,
    stats,
    datasetEmpty,
    allCleared,
    filtersActive,
    hasUnread,
    selectedNotificationId,
    selectNotification,
    clearSelection,
    markRead,
    markAllRead,
    deleteNotification,
    resultCount: items.length,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
}

export default useNotifications;
