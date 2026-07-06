import { useQuery } from '@tanstack/react-query';
import { useRoles } from '../../context/RoleContext';
import { authorQueryKeys } from '../query/queryKeys';
import { useAuthorServices } from './useAuthorServices';

export function useAuthorContext() {
  const { profile, loading: rolesLoading } = useRoles();
  const { context } = useAuthorServices();
  const profileId = profile?.id ?? null;

  const query = useQuery({
    queryKey: authorQueryKeys.context(profileId ?? 'guest'),
    queryFn: () => context.resolveContext(profileId!),
    enabled: Boolean(profileId),
  });

  return {
    authorContext: query.data ?? null,
    authorId: query.data?.authorId ?? null,
    displayName: query.data?.displayName ?? null,
    isLoading: rolesLoading || query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
