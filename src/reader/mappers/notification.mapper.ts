import type { Notification, NotificationCategory } from '../../types/database';
import type {
  MockNotification,
  MockNotificationCategory,
  MockNotificationGroup,
  MockNotificationIcon,
  MockNotificationPriority,
} from '../../data/mockNotifications';

function resolveGroup(timestamp: string): MockNotificationGroup {
  const date = new Date(timestamp);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  if (date >= startOfToday) return 'today';
  if (date >= startOfYesterday) return 'yesterday';
  return 'earlier';
}

function mapCategory(category: NotificationCategory): MockNotificationCategory {
  if (category === 'promotions') return 'promotion';
  if (category === 'account') return 'system';
  return category as MockNotificationCategory;
}

function mapIcon(category: NotificationCategory): MockNotificationIcon {
  return mapCategory(category);
}

export function mapNotificationToMock(notification: Notification): MockNotification {
  const timestamp = notification.created_at;
  const metadata = (notification.metadata ?? {}) as Record<string, unknown>;
  const priority = (metadata.priority as MockNotificationPriority | undefined) ?? 'normal';

  return {
    id: notification.id,
    title: notification.title,
    message: notification.body,
    category: mapCategory(notification.category),
    timestamp,
    isRead: notification.is_read,
    priority,
    actionLabel: notification.action_label ?? 'View',
    actionUrl: notification.action_url ?? '/reader/notifications',
    icon: mapIcon(notification.category),
    group: resolveGroup(timestamp),
  };
}
