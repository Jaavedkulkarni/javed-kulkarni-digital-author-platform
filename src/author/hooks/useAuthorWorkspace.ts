import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authorQueryKeys } from '../query/queryKeys';
import { useAuthorServices } from './useAuthorServices';
import { useAuthorContext } from './useAuthorContext';
import type { TaskStatus, TaskPriority, CalendarEventType } from '../types/common';

export function useAuthorWorkspace() {
  const { authorId } = useAuthorContext();
  const { workspace } = useAuthorServices();
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: authorQueryKeys.tasks(authorId ?? 'guest'),
    queryFn: () => Promise.resolve(workspace.getTasks(authorId!)),
    enabled: Boolean(authorId),
  });

  const goalsQuery = useQuery({
    queryKey: authorQueryKeys.goals(authorId ?? 'guest'),
    queryFn: () => Promise.resolve(workspace.getGoals(authorId!)),
    enabled: Boolean(authorId),
  });

  const achievementsQuery = useQuery({
    queryKey: authorQueryKeys.achievements(authorId ?? 'guest'),
    queryFn: () => Promise.resolve(workspace.getAchievements(authorId!)),
    enabled: Boolean(authorId),
  });

  const calendarQuery = useQuery({
    queryKey: authorQueryKeys.calendar(authorId ?? 'guest'),
    queryFn: () => Promise.resolve(workspace.getCalendar(authorId!)),
    enabled: Boolean(authorId),
  });

  const createTaskMutation = useMutation({
    mutationFn: (input: { title: string; priority?: TaskPriority; dueDate?: string | null }) =>
      Promise.resolve(workspace.createTask(authorId!, input)),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: authorQueryKeys.tasks(authorId!) }),
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      Promise.resolve(workspace.updateTaskStatus(authorId!, taskId, status)),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: authorQueryKeys.tasks(authorId!) }),
  });

  const addEventMutation = useMutation({
    mutationFn: (input: { title: string; eventType: CalendarEventType; eventDate: string }) =>
      Promise.resolve(workspace.addCalendarEvent(authorId!, input)),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: authorQueryKeys.calendar(authorId!) }),
  });

  return {
    tasks: tasksQuery.data ?? [],
    goals: goalsQuery.data ?? [],
    achievements: achievementsQuery.data ?? [],
    calendar: calendarQuery.data ?? [],
    createTask: createTaskMutation.mutateAsync,
    updateTaskStatus: updateTaskMutation.mutateAsync,
    addCalendarEvent: addEventMutation.mutateAsync,
    isLoading: tasksQuery.isLoading,
  };
}
