import { useQuery } from '@tanstack/react-query';
import { useRoles } from '../../context/RoleContext';
import { publisherQueryKeys } from '../query/queryKeys';
import { usePublisherServices } from './usePublisherServices';

export function usePublisherContext() {
  const { profile, loading: rolesLoading } = useRoles();
  const { context } = usePublisherServices();
  const profileId = profile?.id ?? null;

  const query = useQuery({
    queryKey: publisherQueryKeys.context(profileId ?? 'guest'),
    queryFn: () => context.resolveContext(profileId!),
    enabled: Boolean(profileId),
  });

  return {
    publisherContext: query.data ?? null,
    publisherId: query.data?.publisherId ?? null,
    companyName: query.data?.companyName ?? null,
    isLoading: rolesLoading || query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
