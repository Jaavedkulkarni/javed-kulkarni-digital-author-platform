import { useMemo } from 'react';
import { getMockMembershipRecord } from '../data/mockMembership';
import { resolveMembershipView } from '../lib/membershipLogic';

export function useMembership() {
  const record = useMemo(() => getMockMembershipRecord(), []);

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
  };
}
