import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { platformAdminQueryKeys } from '../query/queryKeys';
import { usePlatformAdminServices } from './usePlatformAdminServices';
import type { TicketStatus, TaskPriority } from '../types/common';

export function useSupport(category?: 'reader' | 'author' | 'publisher') {
  const { support } = usePlatformAdminServices();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: platformAdminQueryKeys.support(category),
    queryFn: () => ({ tickets: support.getTickets(category) }),
  });

  const assignMutation = useMutation({
    mutationFn: ({ id, assignee }: { id: string; assignee: string }) => support.assignTicket(id, assignee),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: platformAdminQueryKeys.support(category) }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TicketStatus }) => support.updateStatus(id, status),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: platformAdminQueryKeys.support(category) }),
  });

  const priorityMutation = useMutation({
    mutationFn: ({ id, priority }: { id: string; priority: TaskPriority }) => support.setPriority(id, priority),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: platformAdminQueryKeys.support(category) }),
  });

  return {
    tickets: query.data?.tickets ?? [],
    isLoading: query.isLoading,
    assignMutation,
    statusMutation,
    priorityMutation,
    refetch: query.refetch,
  };
}
