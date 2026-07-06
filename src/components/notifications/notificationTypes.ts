import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  BookMarked,
  BookOpen,
  Crown,
  Megaphone,
  ShoppingBag,
} from 'lucide-react';
export type NotificationSortKey = 'newest' | 'oldest' | 'unread-first' | 'category';

export type NotificationCategory =
  | 'orders'
  | 'reading'
  | 'membership'
  | 'books'
  | 'system'
  | 'promotion';

export type NotificationGroup = 'today' | 'yesterday' | 'earlier';

export type NotificationPriority = 'low' | 'normal' | 'high';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  timestamp: string;
  displayTime: string;
  read: boolean;
  priority: NotificationPriority;
  actionLabel: string;
  actionUrl: string;
  group: NotificationGroup;
}

export interface NotificationStats {
  total: number;
  unread: number;
  orders: number;
  reading: number;
  membership: number;
}

export const NOTIFICATION_CATEGORY_LABELS: Record<NotificationCategory, string> = {
  orders: 'Orders',
  reading: 'Reading',
  membership: 'Membership',
  books: 'Books',
  system: 'System',
  promotion: 'Promotion',
};

export const NOTIFICATION_GROUP_LABELS: Record<NotificationGroup, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  earlier: 'Earlier',
};

export const NOTIFICATION_GROUPS: NotificationGroup[] = ['today', 'yesterday', 'earlier'];

export const NOTIFICATION_SORT_OPTIONS: { value: NotificationSortKey; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'unread-first', label: 'Unread First' },
  { value: 'category', label: 'Category' },
];

export const CATEGORY_STYLES: Record<NotificationCategory, string> = {
  orders:
    'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/15 dark:text-sky-300',
  membership:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300',
  reading:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300',
  books:
    'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/15 dark:text-violet-300',
  system:
    'border-gray-200 bg-gray-100 text-gray-600 dark:border-navy-600 dark:bg-navy-700 dark:text-gray-300',
  promotion:
    'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-300',
};

export const CATEGORY_ICON_STYLES: Record<NotificationCategory, string> = {
  orders: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300',
  reading: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
  membership: 'bg-amber-100 text-amber-600 dark:bg-gold-500/15 dark:text-gold-300',
  books: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300',
  promotion: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300',
  system: 'bg-gray-100 text-gray-600 dark:bg-navy-700 dark:text-gray-300',
};

export const CATEGORY_ICONS: Record<NotificationCategory, LucideIcon> = {
  orders: ShoppingBag,
  membership: Crown,
  reading: BookOpen,
  books: BookMarked,
  system: Bell,
  promotion: Megaphone,
};

export const CARD_SELECTED =
  'border-brand ring-2 ring-brand/30 dark:border-gold-500/40 dark:ring-gold-500/20';

export const CARD_UNREAD =
  'border-l-4 border-l-gold-500 bg-gold-50/60 dark:border-l-gold-500 dark:bg-gold-500/5';

export const CARD_READ =
  'border-gray-200 bg-white dark:border-navy-700 dark:bg-navy-800';

export const CARD_HOVER =
  'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-within:ring-2 focus-within:ring-gold-400/40';
