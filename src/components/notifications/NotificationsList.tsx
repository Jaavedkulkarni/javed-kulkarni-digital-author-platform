import { memo, useEffect, useMemo } from 'react';
import { groupNotifications } from '../../lib/notificationLogic';
import type { NotificationItem } from './notificationTypes';
import { NOTIFICATION_GROUPS, NOTIFICATION_GROUP_LABELS } from './notificationTypes';
import { NotificationCard } from './NotificationCard';
import { NotificationStatePanel } from './NotificationStatePanel';

interface NotificationsListProps {
  items: NotificationItem[];
  datasetEmpty: boolean;
  allCleared: boolean;
  selectedNotificationId: string | null;
  onSelectNotification: (notificationId: string) => void;
  onClearSelection: () => void;
  onMarkRead: (notificationId: string) => void;
  onDeleteNotification: (notificationId: string) => void;
}

export const NotificationsList = memo(function NotificationsList({
  items,
  datasetEmpty,
  allCleared,
  selectedNotificationId,
  onSelectNotification,
  onClearSelection,
  onMarkRead,
  onDeleteNotification,
}: NotificationsListProps) {
  const grouped = useMemo(() => groupNotifications(items), [items]);

  useEffect(() => {
    if (selectedNotificationId && !items.some((item) => item.id === selectedNotificationId)) {
      onClearSelection();
    }
  }, [items, selectedNotificationId, onClearSelection]);

  if (datasetEmpty || allCleared) {
    return <NotificationStatePanel variant="empty" />;
  }

  if (items.length === 0) {
    return <NotificationStatePanel variant="no-results" />;
  }

  return (
    <div className="space-y-5 sm:space-y-6" role="region" aria-label="Notifications list">
      {NOTIFICATION_GROUPS.map((group) => {
        const groupItems = grouped[group];
        if (groupItems.length === 0) return null;

        const headingId = `notifications-group-${group}`;

        return (
          <section key={group} aria-labelledby={headingId} className="space-y-3">
            <h2
              id={headingId}
              className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
            >
              {NOTIFICATION_GROUP_LABELS[group].toUpperCase()} ({groupItems.length})
            </h2>
            <ul role="list" className="space-y-3 sm:space-y-4">
              {groupItems.map((item) => (
                <li key={item.id} role="listitem">
                  <NotificationCard
                    item={item}
                    selected={selectedNotificationId === item.id}
                    onSelect={() => onSelectNotification(item.id)}
                    onMarkRead={() => onMarkRead(item.id)}
                    onDelete={() => onDeleteNotification(item.id)}
                  />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
});

export default NotificationsList;
