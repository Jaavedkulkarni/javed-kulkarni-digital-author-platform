import {
  getTasks,
  createTask,
  updateTaskStatus,
  getGoals,
  createGoal,
  getAchievements,
  getCalendarEvents,
  addCalendarEvent,
} from '../stores/workspaceStore';
import type { AuthorTask, AuthorGoal, AuthorAchievement, CalendarEvent, DashboardOverview } from '../types/workspace.types';
import type { TaskStatus, TaskPriority, CalendarEventType } from '../types/common';

export class AuthorWorkspaceService {
  getTasks(authorId: string): AuthorTask[] {
    return getTasks(authorId);
  }

  createTask(authorId: string, input: {
    title: string;
    description?: string | null;
    priority?: TaskPriority;
    dueDate?: string | null;
    bookId?: string | null;
  }): AuthorTask {
    return createTask(authorId, input);
  }

  updateTaskStatus(authorId: string, taskId: string, status: TaskStatus): AuthorTask | null {
    return updateTaskStatus(authorId, taskId, status);
  }

  getGoals(authorId: string): AuthorGoal[] {
    return getGoals(authorId);
  }

  createGoal(authorId: string, input: {
    title: string;
    targetValue: number;
    unit: string;
    deadline?: string | null;
  }): AuthorGoal {
    return createGoal(authorId, input);
  }

  getAchievements(authorId: string): AuthorAchievement[] {
    return getAchievements(authorId);
  }

  getCalendar(authorId: string): CalendarEvent[] {
    return getCalendarEvents(authorId);
  }

  addCalendarEvent(authorId: string, input: {
    title: string;
    eventType: CalendarEventType;
    eventDate: string;
    bookId?: string | null;
    notes?: string | null;
  }): CalendarEvent {
    return addCalendarEvent(authorId, {
      title: input.title,
      eventType: input.eventType,
      eventDate: input.eventDate,
      bookId: input.bookId ?? null,
      notes: input.notes ?? null,
    });
  }
}

export class AuthorDashboardService {
  async getOverview(params: {
    authorId: string;
    totalBooks: number;
    publishedBooks: number;
    draftBooks: number;
    totalRevenue: number;
    pendingRoyalties: number;
    totalReads: number;
    followerCount: number;
    averageRating: number;
    unreadNotifications: number;
  }): Promise<DashboardOverview> {
    const tasks = getTasks(params.authorId);
    const events = getCalendarEvents(params.authorId);
    const upcoming = events.filter((e) => new Date(e.eventDate) >= new Date()).length;

    return {
      totalBooks: params.totalBooks,
      publishedBooks: params.publishedBooks,
      draftBooks: params.draftBooks,
      totalRevenue: params.totalRevenue,
      pendingRoyalties: params.pendingRoyalties,
      totalReads: params.totalReads,
      followerCount: params.followerCount,
      averageRating: params.averageRating,
      unreadNotifications: params.unreadNotifications,
      upcomingEvents: upcoming,
      activeTasks: tasks.filter((t) => t.status !== 'done' && t.status !== 'cancelled').length,
    };
  }
}

export function createAuthorWorkspaceService(): AuthorWorkspaceService {
  return new AuthorWorkspaceService();
}

export function createAuthorDashboardService(): AuthorDashboardService {
  return new AuthorDashboardService();
}
