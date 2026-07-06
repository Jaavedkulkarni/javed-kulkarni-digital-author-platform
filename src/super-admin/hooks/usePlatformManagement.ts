import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { superAdminQueryKeys } from '../query/queryKeys';
import { useSuperAdminServices } from './useSuperAdminServices';
import type { PeopleFilters } from '../types/people.types';
import type { PlatformAdminDepartment } from '../../platform-admin/types/department.types';
import type { PublisherApprovalStatus } from '../types/publisher.types';
import type { AuthorVerificationStatus } from '../types/author.types';

export function usePlatformManagement(filters?: PeopleFilters) {
  const { people, publishers, authors, platformAdmins } = useSuperAdminServices();
  const queryClient = useQueryClient();
  const filterKey = JSON.stringify(filters ?? {});

  const peopleQuery = useQuery({
    queryKey: superAdminQueryKeys.people(filterKey),
    queryFn: () => people.list(filters),
  });
  const publishersQuery = useQuery({
    queryKey: superAdminQueryKeys.publishers(),
    queryFn: () => publishers.list(),
  });
  const authorsQuery = useQuery({
    queryKey: superAdminQueryKeys.authors(),
    queryFn: () => authors.list(),
  });
  const adminsQuery = useQuery({
    queryKey: superAdminQueryKeys.platformAdmins(),
    queryFn: () => ({ admins: platformAdmins.list(), activity: platformAdmins.getActivity() }),
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: superAdminQueryKeys.people() });
    void queryClient.invalidateQueries({ queryKey: superAdminQueryKeys.publishers() });
    void queryClient.invalidateQueries({ queryKey: superAdminQueryKeys.authors() });
    void queryClient.invalidateQueries({ queryKey: superAdminQueryKeys.platformAdmins() });
  };

  const suspendPersonMutation = useMutation({ mutationFn: (id: string) => people.suspend(id), onSuccess: invalidate });
  const suspendAuthorMutation = useMutation({ mutationFn: (id: string) => authors.suspend(id), onSuccess: invalidate });
  const restoreAuthorMutation = useMutation({ mutationFn: (id: string) => authors.restore(id), onSuccess: invalidate });
  const approvePublisherMutation = useMutation({ mutationFn: (id: string) => publishers.approve(id), onSuccess: invalidate });
  const rejectPublisherMutation = useMutation({ mutationFn: (id: string) => publishers.reject(id), onSuccess: invalidate });
  const setAuthorVerificationMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AuthorVerificationStatus }) => authors.setVerification(id, status),
    onSuccess: invalidate,
  });
  const createAdminMutation = useMutation({
    mutationFn: (input: { name: string; email: string; departments: PlatformAdminDepartment[] }) => platformAdmins.create(input),
    onSuccess: invalidate,
  });
  const deactivateAdminMutation = useMutation({ mutationFn: (id: string) => platformAdmins.deactivate(id), onSuccess: invalidate });

  return {
    people: peopleQuery.data ?? [],
    publishers: publishersQuery.data ?? [],
    authors: authorsQuery.data ?? [],
    platformAdmins: adminsQuery.data?.admins ?? [],
    adminActivity: adminsQuery.data?.activity ?? [],
    isLoading: peopleQuery.isLoading,
    suspendPersonMutation,
    suspendAuthorMutation,
    restoreAuthorMutation,
    approvePublisherMutation,
    rejectPublisherMutation,
    setAuthorVerificationMutation,
    createAdminMutation,
    deactivateAdminMutation,
  };
}

export function usePublisherManagement(status?: PublisherApprovalStatus) {
  const { publishers } = useSuperAdminServices();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: superAdminQueryKeys.publishers(),
    queryFn: () => (status ? publishers.list(status) : publishers.list()),
  });
  const approveMutation = useMutation({
    mutationFn: (id: string) => publishers.approve(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: superAdminQueryKeys.publishers() }),
  });
  return { publishers: query.data ?? [], isLoading: query.isLoading, approveMutation };
}
