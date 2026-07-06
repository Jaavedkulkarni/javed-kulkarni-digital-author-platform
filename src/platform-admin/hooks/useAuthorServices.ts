import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { platformAdminQueryKeys } from '../query/queryKeys';
import { usePlatformAdminServices } from './usePlatformAdminServices';

export function useAuthorServices() {
  const { authorServices } = usePlatformAdminServices();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: platformAdminQueryKeys.authorServices(),
    queryFn: () => ({ queue: authorServices.getQueue() }),
  });

  const assignMutation = useMutation({
    mutationFn: (id: string) => authorServices.assign(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: platformAdminQueryKeys.authorServices() }),
  });

  return { queue: query.data?.queue ?? [], isLoading: query.isLoading, assignMutation, refetch: query.refetch };
}
