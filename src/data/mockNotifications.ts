export type MockNotificationCategory =
  | 'orders'
  | 'reading'
  | 'membership'
  | 'books'
  | 'system'
  | 'promotion';

export type MockNotificationGroup = 'today' | 'yesterday' | 'earlier';

export type MockNotificationPriority = 'low' | 'normal' | 'high';

export type MockNotificationIcon =
  | 'orders'
  | 'reading'
  | 'membership'
  | 'books'
  | 'system'
  | 'promotion';

export interface MockNotification {
  id: string;
  title: string;
  message: string;
  category: MockNotificationCategory;
  timestamp: string;
  isRead: boolean;
  priority: MockNotificationPriority;
  actionLabel: string;
  actionUrl: string;
  icon: MockNotificationIcon;
  group: MockNotificationGroup;
}

/** Synced at runtime by reader data layer. */
export const MOCK_NOTIFICATIONS: MockNotification[] = [];
