import { getNotifications, markNotificationRead } from '../stores/dashboardStore';

export class NotificationService {
  list() { return getNotifications(); }
  unreadCount() { return getNotifications().filter((n) => !n.read).length; }
  markRead(id: string) { markNotificationRead(id); }
}

export function createNotificationService(): NotificationService {
  return new NotificationService();
}
