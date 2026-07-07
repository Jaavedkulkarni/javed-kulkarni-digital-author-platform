import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useRoles } from '../../context/RoleContext';
import { getErrorMessage } from '../../lib/utils/errors';
import { useOrganizationServices } from './useOrganizationServices';

export function useBecomeAuthor() {
  const { profile, refreshRoles } = useRoles();
  const { onboarding } = useOrganizationServices();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!profile?.id) throw new Error('Sign in required.');
      const displayName =
        profile.full_name?.trim() ||
        profile.email?.split('@')[0] ||
        'Author';
      const result = await onboarding.becomeAuthor({ userId: profile.id, displayName });
      if (!result.success) {
        throw new Error(result.errors?.join(' ') ?? 'Failed to become author.');
      }
      return result;
    },
    onError: (error) => {
      console.error('[becomeAuthor]', getErrorMessage(error));
    },
    onSuccess: async () => {
      await refreshRoles();
      navigate('/author');
    },
  });

  return {
    becomeAuthor: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
