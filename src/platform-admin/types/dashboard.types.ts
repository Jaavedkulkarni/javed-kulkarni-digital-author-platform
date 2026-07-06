import type { PlatformAdminDepartment } from './department.types';

export interface PlatformAdminDashboardOverview {
  pendingTasks: number;
  todaysQueue: number;
  unreadNotifications: number;
  upcomingCalendar: number;
  departmentCounts: Partial<Record<PlatformAdminDepartment, number>>;
}

export interface PendingTask {
  id: string;
  department: PlatformAdminDepartment;
  title: string;
  priority: string;
  dueDate: string | null;
}

export interface RecentActivity {
  id: string;
  department: PlatformAdminDepartment;
  message: string;
  actor: string;
  createdAt: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  department: PlatformAdminDepartment | null;
  read: boolean;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  eventDate: string;
  department: PlatformAdminDepartment | null;
}

export interface DepartmentPerformance {
  department: PlatformAdminDepartment;
  completedToday: number;
  pending: number;
  avgResolutionHours: number;
}

export interface QuickAction {
  id: string;
  label: string;
  department: PlatformAdminDepartment;
  path: string;
}
