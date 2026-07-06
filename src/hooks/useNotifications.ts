import { useCallback, useMemo, useState } from 'react';
import { MOCK_NOTIFICATIONS } from '../data/mockNotifications';
import {
  calculateStatistics,
  DEFAULT_NOTIFICATION_FILTERS,
  hasActiveNotificationFilters,
  processNotifications,
  type NotificationFilters,
  type NotificationSortKey,
} from '../lib/notificationLogic';

export function useNotifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<NotificationFilters>(DEFAULT_NOTIFICATION_FILTERS);
  const [sortKey, setSortKey] = useState<NotificationSortKey>('newest');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);

  const datasetEmpty = MOCK_NOTIFICATIONS.length === 0;

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

  const markRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification
      )
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId));
    setSelectedNotificationId((current) => (current === notificationId ? null : current));
  }, []);

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
  };
}

export default useNotifications;
