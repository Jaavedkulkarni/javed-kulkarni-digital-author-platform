import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { superAdminQueryKeys } from '../query/queryKeys';
import { useSuperAdminServices } from './useSuperAdminServices';

export function useBusiness() {
  const { business } = useSuperAdminServices();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: superAdminQueryKeys.business(), queryFn: () => business.list() });
  const updateMutation = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) => business.updatePolicy(id, value),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: superAdminQueryKeys.business() }),
  });
  return { policies: query.data ?? [], isLoading: query.isLoading, updateMutation };
}
