import type { TaskPriority, TaskStatus, CalendarEventType } from './common';

export interface AuthorTask {
  id: string;
  authorId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  bookId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorGoal {
  id: string;
  authorId: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string | null;
  createdAt: string;
}

export interface AuthorAchievement {
  id: string;
  authorId: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  progress: number;
  target: number;
}

export interface CalendarEvent {
  id: string;
  authorId: string;
  title: string;
  eventType: CalendarEventType;
  eventDate: string;
  bookId: string | null;
  notes: string | null;
}

export interface DashboardOverview {
  totalBooks: number;
  publishedBooks: number;
  draftBooks: number;
  totalRevenue: number;
  pendingRoyalties: number;
  totalReads: number;
  followerCount: number;
  averageRating: number;
  unreadNotifications: number;
  upcomingEvents: number;
  activeTasks: number;
}
