import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { resolveMembershipView } from '../../lib/membershipLogic';
import { readerQueryKeys } from '../query/queryKeys';
import { fetchMembership } from '../services/membership.service';
import { useReaderUserId } from './useReaderUserId';
import { useOnlineStatus } from '../utils/offline';

export function useMembership() {
  const userId = useReaderUserId();
  const isOnline = useOnlineStatus();

  const query = useQuery({
    queryKey: readerQueryKeys.membership(userId ?? 'guest'),
    queryFn: () => fetchMembership(userId!),
    enabled: Boolean(userId) && isOnline,
  });

  const record = useMemo(
    () =>
      query.data ?? {
        currentPlanId: 'free' as const,
        status: 'none' as const,
        expiryDate: null,
        daysRemaining: null,
      },
    [query.data]
  );

  const view = useMemo(() => resolveMembershipView(record), [record]);

  return {
    isGuest: view.isGuest,
    currentPlan: view.currentPlan,
    status: view.status,
    expiryDate: view.expiryDate,
    daysRemaining: view.daysRemaining,
    daysRemainingValue: view.daysRemainingValue,
    planDurationDays: view.planDurationDays,
    availablePlans: view.availablePlans,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export default useMembership;
