import {
  NOTIFICATION_CATEGORY_LABELS,
  type NotificationCategory,
  type NotificationGroup,
  type NotificationItem,
  type NotificationSortKey,
  type NotificationStats,
} from '../components/notifications/notificationTypes';
import type { MockNotification } from '../data/mockNotifications';

export type { NotificationSortKey, NotificationStats };

export type NotificationCategoryFilter = 'all' | NotificationCategory;

export type NotificationReadFilter = 'all' | 'read' | 'unread';

export interface NotificationFilters {
  category: NotificationCategoryFilter;
  read: NotificationReadFilter;
}

export const DEFAULT_NOTIFICATION_FILTERS: NotificationFilters = {
  category: 'all',
  read: 'all',
};

export interface GroupedNotifications {
  today: NotificationItem[];
  yesterday: NotificationItem[];
  earlier: NotificationItem[];
}

function timestampValue(isoDate: string): number {
  const time = new Date(isoDate).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function formatNotificationTime(timestamp: string, group: NotificationGroup): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;

  const time = date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (group === 'today') return time;
  if (group === 'yesterday') return `Yesterday, ${time}`;

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function toNotificationItem(record: MockNotification): NotificationItem {
  return {
    id: record.id,
    title: record.title,
    message: record.message,
    category: record.category,
    timestamp: record.timestamp,
    displayTime: formatNotificationTime(record.timestamp, record.group),
    read: record.isRead,
    priority: record.priority,
    actionLabel: record.actionLabel,
    actionUrl: record.actionUrl,
    group: record.group,
  };
}

export function searchNotifications(records: MockNotification[], query: string): MockNotification[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return records;

  return records.filter((record) => {
    const categoryLabel = NOTIFICATION_CATEGORY_LABELS[record.category].toLowerCase();
    return (
      record.title.toLowerCase().includes(normalized) ||
      record.message.toLowerCase().includes(normalized) ||
      categoryLabel.includes(normalized) ||
      record.category.toLowerCase().includes(normalized)
    );
  });
}

export function filterNotifications(
  records: MockNotification[],
  filters: NotificationFilters,
  unreadOnly: boolean
): MockNotification[] {
  return records.filter((record) => {
    if (filters.category !== 'all' && record.category !== filters.category) return false;

    if (unreadOnly && record.isRead) return false;

    if (filters.read === 'read' && !record.isRead) return false;
    if (filters.read === 'unread' && record.isRead) return false;

    return true;
  });
}

export function sortNotifications(
  records: MockNotification[],
  sortKey: NotificationSortKey
): MockNotification[] {
  const sorted = [...records];

  switch (sortKey) {
    case 'newest':
      return sorted.sort((a, b) => timestampValue(b.timestamp) - timestampValue(a.timestamp));
    case 'oldest':
      return sorted.sort((a, b) => timestampValue(a.timestamp) - timestampValue(b.timestamp));
    case 'unread-first':
      return sorted.sort((a, b) => {
        if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
        return timestampValue(b.timestamp) - timestampValue(a.timestamp);
      });
    case 'category':
      return sorted.sort((a, b) => {
        const categoryCompare = NOTIFICATION_CATEGORY_LABELS[a.category].localeCompare(
          NOTIFICATION_CATEGORY_LABELS[b.category],
          'en',
          { sensitivity: 'base' }
        );
        if (categoryCompare !== 0) return categoryCompare;
        return timestampValue(b.timestamp) - timestampValue(a.timestamp);
      });
    default:
      return sorted;
  }
}

export function groupNotifications(items: NotificationItem[]): GroupedNotifications {
  const grouped: GroupedNotifications = {
    today: [],
    yesterday: [],
    earlier: [],
  };

  for (const item of items) {
    grouped[item.group].push(item);
  }

  return grouped;
}

export function calculateStatistics(records: MockNotification[]): NotificationStats {
  let unread = 0;
  let orders = 0;
  let reading = 0;
  let membership = 0;

  for (const record of records) {
    if (!record.isRead) unread += 1;
    if (record.category === 'orders') orders += 1;
    if (record.category === 'reading') reading += 1;
    if (record.category === 'membership') membership += 1;
  }

  return {
    total: records.length,
    unread,
    orders,
    reading,
    membership,
  };
}

export function hasActiveNotificationFilters(
  filters: NotificationFilters,
  searchQuery: string,
  unreadOnly: boolean
): boolean {
  return (
    searchQuery.trim().length > 0 ||
    unreadOnly ||
    filters.category !== 'all' ||
    filters.read !== 'all'
  );
}

export function processNotifications(
  records: MockNotification[],
  query: string,
  filters: NotificationFilters,
  unreadOnly: boolean,
  sortKey: NotificationSortKey
): NotificationItem[] {
  const searched = searchNotifications(records, query);
  const filtered = filterNotifications(searched, filters, unreadOnly);
  const sorted = sortNotifications(filtered, sortKey);
  return sorted.map((record) => toNotificationItem(record));
}
