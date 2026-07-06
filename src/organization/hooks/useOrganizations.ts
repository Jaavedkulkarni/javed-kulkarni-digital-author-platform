import { useQuery } from '@tanstack/react-query';
import { useRoles as useAppRoles } from '../../context/RoleContext';
import { organizationQueryKeys } from '../query/queryKeys';
import { useOrganizationServices } from './useOrganizationServices';

export function useOrganizations() {
  const { profile } = useAppRoles();
  const { organizations } = useOrganizationServices();
  const userId = profile?.id ?? null;

  const listQuery = useQuery({
    queryKey: organizationQueryKeys.organizations(userId ?? 'guest'),
    queryFn: () => organizations.listForUser(userId!),
    enabled: Boolean(userId),
  });

  return {
    organizations: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    refetch: listQuery.refetch,
  };
}

export function useOrganization(orgId: string | null) {
  const { organizations } = useOrganizationServices();

  const query = useQuery({
    queryKey: organizationQueryKeys.organization(orgId ?? ''),
    queryFn: () => organizations.getById(orgId!),
    enabled: Boolean(orgId),
  });

  return { organization: query.data ?? null, isLoading: query.isLoading };
}

export function useOrganizationMembers(orgId: string | null) {
  const { organizations } = useOrganizationServices();

  const query = useQuery({
    queryKey: organizationQueryKeys.members(orgId ?? ''),
    queryFn: () => organizations.getMembers(orgId!),
    enabled: Boolean(orgId),
  });

  return { members: query.data ?? [], isLoading: query.isLoading };
}
