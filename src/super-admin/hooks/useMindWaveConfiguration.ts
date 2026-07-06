import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { superAdminQueryKeys } from '../query/queryKeys';
import { useSuperAdminServices } from './useSuperAdminServices';
import type { MindWaveConfiguration } from '../types/mindwave.types';

export function useMindWaveConfiguration() {
  const { mindWave } = useSuperAdminServices();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: superAdminQueryKeys.mindwave(), queryFn: () => mindWave.getConfig() });
  const updateMutation = useMutation({
    mutationFn: (updates: Partial<MindWaveConfiguration>) => mindWave.update(updates),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: superAdminQueryKeys.mindwave() }),
  });
  const toggleMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => mindWave.toggleProvider(id, enabled),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: superAdminQueryKeys.mindwave() }),
  });
  return { config: query.data, isLoading: query.isLoading, updateMutation, toggleMutation };
}
