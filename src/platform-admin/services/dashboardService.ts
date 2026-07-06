import {
  getDashboardOverview,
  getPendingTasks,
  getRecentActivity,
  getNotifications,
  getCalendarEvents,
  getDepartmentPerformance,
  getQuickActions,
  markNotificationRead,
} from '../stores/dashboardStore';

export class DashboardService {
  getOverview() { return getDashboardOverview(); }
  getPendingTasks() { return getPendingTasks(); }
  getRecentActivity() { return getRecentActivity(); }
  getNotifications() { return getNotifications(); }
  getCalendar() { return getCalendarEvents(); }
  getDepartmentPerformance() { return getDepartmentPerformance(); }
  getQuickActions() { return getQuickActions(); }
  markNotificationRead(id: string) { markNotificationRead(id); }
}

export function createDashboardService(): DashboardService {
  return new DashboardService();
}
