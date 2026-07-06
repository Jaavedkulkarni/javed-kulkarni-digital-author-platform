import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authorQueryKeys } from '../query/queryKeys';
import { useAuthorServices } from './useAuthorServices';
import { useAuthorContext } from './useAuthorContext';
import type { UpdateKycProfileInput } from '../types/kyc.types';

export function useAuthorKyc() {
  const { authorId } = useAuthorContext();
  const { kyc } = useAuthorServices();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: authorQueryKeys.kyc(authorId ?? 'guest'),
    queryFn: () => Promise.resolve(kyc.getProfile(authorId!)),
    enabled: Boolean(authorId),
  });

  const updateMutation = useMutation({
    mutationFn: (input: UpdateKycProfileInput) => Promise.resolve(kyc.updateProfile(authorId!, input)),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: authorQueryKeys.kyc(authorId!) }),
  });

  const submitMutation = useMutation({
    mutationFn: () => Promise.resolve(kyc.submitForVerification(authorId!)),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: authorQueryKeys.kyc(authorId!) }),
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    updateProfile: updateMutation.mutateAsync,
    submitForVerification: submitMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
