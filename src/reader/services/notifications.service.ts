import { withRetry } from '../../lib/utils/retry';
import { getReaderDataAccess } from '../infrastructure/readerDataAccess';
import { mapNotificationToMock } from '../mappers/notification.mapper';
import type { MockNotification } from '../../data/mockNotifications';

export async function fetchNotifications(userId: string): Promise<MockNotification[]> {
  const { repositories } = getReaderDataAccess();
  const rows = await withRetry(
    async () => repositories.notifications.findByUser(userId),
    { scope: 'reader.notifications.fetch' }
  );
  return rows.map(mapNotificationToMock);
}

export async function markNotificationRead(notificationId: string) {
  const { repositories } = getReaderDataAccess();
  return repositories.notifications.updateNotification(notificationId, { is_read: true });
}

export async function markAllNotificationsRead(userId: string) {
  const { repositories } = getReaderDataAccess();
  const unread = await repositories.notifications.findUnreadByUser(userId);
  await Promise.all(
    unread.map((notification) =>
      repositories.notifications.updateNotification(notification.id, { is_read: true })
    )
  );
}

export async function archiveNotification(notificationId: string) {
  const { repositories } = getReaderDataAccess();
  return repositories.notifications.updateNotification(notificationId, { is_archived: true });
}
