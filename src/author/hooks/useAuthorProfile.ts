import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authorQueryKeys } from '../query/queryKeys';
import { useAuthorServices } from './useAuthorServices';
import { useAuthorContext } from './useAuthorContext';
import type { UpdateAuthorProfileInput } from '../types/author.types';

export function useAuthorProfile() {
  const { authorId } = useAuthorContext();
  const { profile: profileService } = useAuthorServices();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: authorQueryKeys.profile(authorId ?? 'guest'),
    queryFn: () => profileService.getProfile(authorId!),
    enabled: Boolean(authorId),
  });

  const updateMutation = useMutation({
    mutationFn: (input: UpdateAuthorProfileInput) => profileService.update(authorId!, input),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: authorQueryKeys.profile(authorId!) }),
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
