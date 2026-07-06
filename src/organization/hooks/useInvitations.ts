import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { organizationQueryKeys } from '../query/queryKeys';
import { useOrganizationServices } from './useOrganizationServices';
import { useRoles as useAppRoles } from '../../context/RoleContext';
import type { CreateOrganizationInvitationInput } from '../types/invitation.types';

export function useInvitations(organizationId?: string) {
  const { invitations } = useOrganizationServices();

  const query = useQuery({
    queryKey: organizationQueryKeys.invitations(organizationId),
    queryFn: () =>
      organizationId ? invitations.listForOrganization(organizationId) : invitations.list(),
  });

  return { invitations: query.data ?? [], isLoading: query.isLoading, refetch: query.refetch };
}

export function useInvitationMutations() {
  const { invitations } = useOrganizationServices();
  const { profile } = useAppRoles();
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: [...organizationQueryKeys.all, 'invitations'] });
  };

  const createMutation = useMutation({
    mutationFn: (input: Omit<CreateOrganizationInvitationInput, 'invitedBy'>) =>
      invitations.create({ ...input, invitedBy: profile?.id ?? '' }),
    onSuccess: invalidate,
  });

  const acceptMutation = useMutation({
    mutationFn: (token: string) =>
      invitations.accept({ token, userId: profile?.id ?? '' }),
    onSuccess: invalidate,
  });

  const revokeMutation = useMutation({
    mutationFn: (id: string) => invitations.revoke(id, profile?.id ?? ''),
    onSuccess: invalidate,
  });

  return { createMutation, acceptMutation, revokeMutation };
}
