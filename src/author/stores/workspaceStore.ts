import type { AuthorTask, AuthorGoal, AuthorAchievement, CalendarEvent } from '../types/workspace.types';
import type { TaskPriority, TaskStatus } from '../types/common';
import { ACHIEVEMENT_DEFINITIONS } from '../constants/author.constants';

const tasks = new Map<string, AuthorTask[]>();
const goals = new Map<string, AuthorGoal[]>();
const achievements = new Map<string, AuthorAchievement[]>();
const calendar = new Map<string, CalendarEvent[]>();

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getTasks(authorId: string): AuthorTask[] {
  return tasks.get(authorId) ?? [];
}

export function createTask(authorId: string, input: {
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  dueDate?: string | null;
  bookId?: string | null;
}): AuthorTask {
  const task: AuthorTask = {
    id: createId('task'),
    authorId,
    title: input.title,
    description: input.description ?? null,
    status: 'todo',
    priority: input.priority ?? 'medium',
    dueDate: input.dueDate ?? null,
    bookId: input.bookId ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.set(authorId, [...getTasks(authorId), task]);
  return task;
}

export function updateTaskStatus(authorId: string, taskId: string, status: TaskStatus): AuthorTask | null {
  const list = getTasks(authorId).map((t) =>
    t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString() } : t
  );
  tasks.set(authorId, list);
  return list.find((t) => t.id === taskId) ?? null;
}

export function getGoals(authorId: string): AuthorGoal[] {
  return goals.get(authorId) ?? [];
}

export function createGoal(authorId: string, input: {
  title: string;
  targetValue: number;
  unit: string;
  deadline?: string | null;
}): AuthorGoal {
  const goal: AuthorGoal = {
    id: createId('goal'),
    authorId,
    title: input.title,
    targetValue: input.targetValue,
    currentValue: 0,
    unit: input.unit,
    deadline: input.deadline ?? null,
    createdAt: new Date().toISOString(),
  };
  goals.set(authorId, [...getGoals(authorId), goal]);
  return goal;
}

export function getAchievements(authorId: string): AuthorAchievement[] {
  const existing = achievements.get(authorId);
  if (existing) return existing;
  const seeded = ACHIEVEMENT_DEFINITIONS.map((def) => ({
    id: def.id,
    authorId,
    title: def.title,
    description: def.description,
    icon: def.icon,
    unlockedAt: null,
    progress: 0,
    target: def.target,
  }));
  achievements.set(authorId, seeded);
  return seeded;
}

export function getCalendarEvents(authorId: string): CalendarEvent[] {
  return calendar.get(authorId) ?? [];
}

export function addCalendarEvent(authorId: string, input: Omit<CalendarEvent, 'id' | 'authorId'>): CalendarEvent {
  const event: CalendarEvent = { id: createId('cal'), authorId, ...input };
  calendar.set(authorId, [...getCalendarEvents(authorId), event]);
  return event;
}

export function resetWorkspaceStore(): void {
  tasks.clear();
  goals.clear();
  achievements.clear();
  calendar.clear();
}
