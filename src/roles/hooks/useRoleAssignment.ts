import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SystemRole } from '../../types/roles';
import { useCurrentUserRoles, useRoleManagementContext } from './useCurrentUserRoles';
import { roleQueryKeys } from '../query/queryKeys';
import type { AssignUserRoleInput, RemoveUserRoleInput } from '../types/assignment.types';

export function useRoleAssignment(targetUserId: string | null | undefined) {
  const { services, refreshRoles } = useRoleManagementContext();
  const { roles: actorRoles, userId: actorId } = useCurrentUserRoles();
  const queryClient = useQueryClient();

  const targetRolesQuery = useQuery({
    queryKey: roleQueryKeys.assignments(targetUserId ?? 'guest'),
    queryFn: () => services.assignments.getUserRoles(targetUserId!),
    enabled: Boolean(targetUserId),
  });

  const historyQuery = useQuery({
    queryKey: roleQueryKeys.assignmentHistory(targetUserId ?? 'guest'),
    queryFn: () => services.assignments.getAssignmentHistory(targetUserId!),
    enabled: Boolean(targetUserId) && services.validation.canManageAssignments(actorRoles),
  });

  const assignableRoles = useMemo(
    () => services.assignments.getAssignableRoles(actorRoles),
    [services.assignments, actorRoles]
  );

  const availableRoles = useMemo(() => {
    const current = targetRolesQuery.data ?? [];
    return assignableRoles.filter((role) => !current.includes(role));
  }, [assignableRoles, targetRolesQuery.data]);

  const removableRoles = useMemo(() => {
    const removable = services.validation.getRemovableRoles(actorRoles);
    const current = targetRolesQuery.data ?? [];
    return current.filter((role) => removable.includes(role));
  }, [services.validation, actorRoles, targetRolesQuery.data]);

  const invalidateTarget = useCallback(async () => {
    if (!targetUserId) return;
    await queryClient.invalidateQueries({ queryKey: roleQueryKeys.assignments(targetUserId) });
    await queryClient.invalidateQueries({ queryKey: roleQueryKeys.assignmentHistory(targetUserId) });
    await refreshRoles();
  }, [targetUserId, queryClient, refreshRoles]);

  const assignMutation = useMutation({
    mutationFn: (input: Omit<AssignUserRoleInput, 'targetUserId'>) =>
      services.assignments.assignUserRole({ ...input, targetUserId: targetUserId! }),
    onSuccess: async (result) => {
      if (result.success) await invalidateTarget();
    },
  });

  const removeMutation = useMutation({
    mutationFn: (input: Omit<RemoveUserRoleInput, 'targetUserId'>) =>
      services.assignments.removeUserRole({ ...input, targetUserId: targetUserId! }),
    onSuccess: async (result) => {
      if (result.success) await invalidateTarget();
    },
  });

  const assignUserRole = useCallback(
    async (role: SystemRole, reason?: string | null) => {
      if (!targetUserId || !actorId) {
        return { success: false as const, errors: ['Authentication required.'] };
      }
      return assignMutation.mutateAsync({ role, reason });
    },
    [targetUserId, actorId, assignMutation]
  );

  const removeUserRole = useCallback(
    async (role: SystemRole, reason?: string | null) => {
      if (!targetUserId || !actorId) {
        return { success: false as const, errors: ['Authentication required.'] };
      }
      return removeMutation.mutateAsync({ role, reason });
    },
    [targetUserId, actorId, removeMutation]
  );

  return {
    actorId,
    actorRoles,
    targetUserId,
    currentRoles: targetRolesQuery.data ?? [],
    assignableRoles,
    availableRoles,
    removableRoles,
    history: historyQuery.data ?? [],
    canManage: services.validation.canManageAssignments(actorRoles),
    isLoading: targetRolesQuery.isLoading || historyQuery.isLoading,
    isAssigning: assignMutation.isPending,
    isRemoving: removeMutation.isPending,
    assignError: assignMutation.error,
    removeError: removeMutation.error,
    lastAssignResult: assignMutation.data,
    lastRemoveResult: removeMutation.data,
    assignUserRole,
    removeUserRole,
    refresh: invalidateTarget,
  };
}

export type RoleAssignmentHook = ReturnType<typeof useRoleAssignment>;
