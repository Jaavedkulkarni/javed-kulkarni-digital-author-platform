import type {
  PlatformAdminDashboardOverview,
  PendingTask,
  RecentActivity,
  AdminNotification,
  CalendarEvent,
  DepartmentPerformance,
  QuickAction,
} from '../types/dashboard.types';
import { getBookReviews } from './reviewStore';
import { getTickets } from './supportStore';
import { getWithdrawals } from './financeStore';
import { getPaperbackRequests } from './paperbackStore';
import { generateId } from '../utils/permissions';

const notifications: AdminNotification[] = [
  { id: generateId('nt'), title: 'Book review pending', message: '2 books awaiting content review', department: 'content', read: false, createdAt: new Date().toISOString() },
  { id: generateId('nt'), title: 'Withdrawal request', message: '1 author withdrawal pending approval', department: 'finance', read: false, createdAt: new Date().toISOString() },
];

const calendar: CalendarEvent[] = [
  { id: generateId('cal'), title: 'Content review standup', eventDate: new Date().toISOString(), department: 'content' },
];

export function getNotifications(): AdminNotification[] {
  return notifications;
}

export function getCalendarEvents(): CalendarEvent[] {
  return calendar;
}

export function getDashboardOverview(): PlatformAdminDashboardOverview {
  const pendingBooks = getBookReviews().filter((b) => b.status === 'pending').length;
  const openTickets = getTickets().filter((t) => t.status === 'open' || t.status === 'assigned').length;
  const pendingWithdrawals = getWithdrawals().filter((w) => w.status === 'pending').length;
  const paperbackPending = getPaperbackRequests().filter((r) => r.status === 'pending').length;

  return {
    pendingTasks: pendingBooks + openTickets + pendingWithdrawals + paperbackPending,
    todaysQueue: pendingBooks + openTickets,
    unreadNotifications: notifications.filter((n) => !n.read).length,
    upcomingCalendar: calendar.length,
    departmentCounts: {
      content: pendingBooks,
      support: openTickets,
      finance: pendingWithdrawals,
      paperback: paperbackPending,
    },
  };
}

export function getPendingTasks(): PendingTask[] {
  return [
    ...getBookReviews().filter((b) => b.status === 'pending').map((b) => ({
      id: b.id,
      department: 'content' as const,
      title: `Review: ${b.bookTitle}`,
      priority: 'normal',
      dueDate: null,
    })),
    ...getTickets().filter((t) => t.status === 'open').map((t) => ({
      id: t.id,
      department: 'support' as const,
      title: t.subject,
      priority: t.priority,
      dueDate: null,
    })),
  ];
}

export function getRecentActivity(): RecentActivity[] {
  return [
    { id: generateId('act'), department: 'content', message: 'Book submitted for review', actor: 'System', createdAt: new Date().toISOString() },
    { id: generateId('act'), department: 'finance', message: 'Withdrawal request received', actor: 'System', createdAt: new Date().toISOString() },
  ];
}

export function getDepartmentPerformance(): DepartmentPerformance[] {
  return [
    { department: 'content', completedToday: 3, pending: getBookReviews().filter((b) => b.status === 'pending').length, avgResolutionHours: 4 },
    { department: 'support', completedToday: 5, pending: getTickets().filter((t) => t.status !== 'closed').length, avgResolutionHours: 6 },
    { department: 'finance', completedToday: 2, pending: getWithdrawals().filter((w) => w.status === 'pending').length, avgResolutionHours: 8 },
  ];
}

export function getQuickActions(): QuickAction[] {
  return [
    { id: 'qa1', label: 'Review Books', department: 'content', path: '/platform-admin/content' },
    { id: 'qa2', label: 'Open Tickets', department: 'support', path: '/platform-admin/support' },
    { id: 'qa3', label: 'Process Withdrawals', department: 'finance', path: '/platform-admin/finance' },
  ];
}

export function markNotificationRead(id: string): void {
  const n = notifications.find((x) => x.id === id);
  if (n) n.read = true;
}
