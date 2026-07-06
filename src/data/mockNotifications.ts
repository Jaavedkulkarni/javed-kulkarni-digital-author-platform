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

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: 'notif-1',
    title: 'Order Confirmed',
    message: 'Your order for डिजिटल कैद has been confirmed and is ready to download.',
    category: 'orders',
    timestamp: '2026-07-05T09:30:00',
    isRead: false,
    priority: 'high',
    actionLabel: 'View Order',
    actionUrl: '/reader/orders',
    icon: 'orders',
    group: 'today',
  },
  {
    id: 'notif-2',
    title: 'Continue Reading',
    message: 'You are 62% through डिजिटल कैद. Pick up where you left off.',
    category: 'reading',
    timestamp: '2026-07-05T08:15:00',
    isRead: false,
    priority: 'normal',
    actionLabel: 'Continue',
    actionUrl: '/reader/library',
    icon: 'reading',
    group: 'today',
  },
  {
    id: 'notif-3',
    title: 'Membership Renewal Reminder',
    message: 'Your premium membership renews in 14 days.',
    category: 'membership',
    timestamp: '2026-07-05T07:00:00',
    isRead: true,
    priority: 'normal',
    actionLabel: 'Manage Membership',
    actionUrl: '/reader/membership',
    icon: 'membership',
    group: 'today',
  },
  {
    id: 'notif-4',
    title: 'New Book Available',
    message: 'A new title in Parenting is now available in your library.',
    category: 'books',
    timestamp: '2026-07-04T18:45:00',
    isRead: false,
    priority: 'normal',
    actionLabel: 'Browse Book',
    actionUrl: '/reader/library',
    icon: 'books',
    group: 'yesterday',
  },
  {
    id: 'notif-5',
    title: 'Weekly Reading Summary',
    message: 'You read 5h 18m this week across 4 books.',
    category: 'reading',
    timestamp: '2026-07-04T10:00:00',
    isRead: true,
    priority: 'low',
    actionLabel: 'View Insights',
    actionUrl: '/reader/reading-insights',
    icon: 'reading',
    group: 'yesterday',
  },
  {
    id: 'notif-6',
    title: 'Download Ready',
    message: 'Your audiobook download for पालकत्वाची कला is ready offline.',
    category: 'books',
    timestamp: '2026-07-04T08:20:00',
    isRead: false,
    priority: 'normal',
    actionLabel: 'Open Downloads',
    actionUrl: '/reader/downloads',
    icon: 'books',
    group: 'yesterday',
  },
  {
    id: 'notif-7',
    title: 'Order Invoice Generated',
    message: 'Invoice #INV-2841 for your recent purchase is available.',
    category: 'orders',
    timestamp: '2026-07-04T07:10:00',
    isRead: true,
    priority: 'low',
    actionLabel: 'View Invoice',
    actionUrl: '/reader/orders',
    icon: 'orders',
    group: 'yesterday',
  },
  {
    id: 'notif-8',
    title: 'Limited-Time Offer',
    message: 'Save 20% on annual membership this week only.',
    category: 'promotion',
    timestamp: '2026-07-02T14:20:00',
    isRead: false,
    priority: 'high',
    actionLabel: 'View Offer',
    actionUrl: '/reader/membership',
    icon: 'promotion',
    group: 'earlier',
  },
  {
    id: 'notif-9',
    title: 'System Maintenance',
    message: 'Scheduled maintenance completed successfully. All services are online.',
    category: 'system',
    timestamp: '2026-06-28T22:00:00',
    isRead: true,
    priority: 'low',
    actionLabel: 'Learn More',
    actionUrl: '#',
    icon: 'system',
    group: 'earlier',
  },
  {
    id: 'notif-10',
    title: 'Order Shipped',
    message: 'Your physical order #ORD-2841 has been shipped.',
    category: 'orders',
    timestamp: '2026-06-25T11:30:00',
    isRead: true,
    priority: 'normal',
    actionLabel: 'Track Order',
    actionUrl: '/reader/orders',
    icon: 'orders',
    group: 'earlier',
  },
  {
    id: 'notif-11',
    title: 'Reading Goal Achieved',
    message: 'Congratulations! You completed your weekly reading goal.',
    category: 'reading',
    timestamp: '2026-06-22T16:00:00',
    isRead: false,
    priority: 'normal',
    actionLabel: 'View Goals',
    actionUrl: '/reader/reading-insights',
    icon: 'reading',
    group: 'earlier',
  },
  {
    id: 'notif-12',
    title: 'Membership Welcome',
    message: 'Welcome to Premium! Explore exclusive member books and benefits.',
    category: 'membership',
    timestamp: '2026-06-18T09:00:00',
    isRead: true,
    priority: 'normal',
    actionLabel: 'Explore Benefits',
    actionUrl: '/reader/membership',
    icon: 'membership',
    group: 'earlier',
  },
];
