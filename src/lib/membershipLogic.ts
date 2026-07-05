import type { MembershipPlanDefinition, MembershipStatus } from '../components/membership/membershipTypes';
import { MEMBERSHIP_PLANS, PLAN_DURATION_DAYS } from '../components/membership/membershipTypes';
import type { MockMembershipRecord } from '../data/mockMembership';

const PLAN_NAME_BY_ID = Object.fromEntries(
  MEMBERSHIP_PLANS.map((plan) => [plan.id, plan.name])
) as Record<string, string>;

export function isMembershipGuest(status: MembershipStatus): boolean {
  return status === 'none';
}

export function formatMembershipPlanLabel(planId: string): string {
  return PLAN_NAME_BY_ID[planId] ?? planId;
}

export function formatDaysRemaining(days: number | null): string {
  if (days === null) return '—';
  return String(days);
}

export function formatExpiryDate(date: string | null): string {
  return date ?? '—';
}

export function buildAvailablePlans(currentPlanId: string): MembershipPlanDefinition[] {
  return MEMBERSHIP_PLANS.map((plan) => ({
    ...plan,
    isCurrent: plan.id === currentPlanId,
    isPopular: plan.id === 'yearly',
    isComingSoon: plan.id === 'lifetime',
  }));
}

export function getPlanDurationDays(planId: string): number {
  return PLAN_DURATION_DAYS[planId as keyof typeof PLAN_DURATION_DAYS] ?? 365;
}

export function resolveMembershipView(record: MockMembershipRecord) {
  const isGuest = isMembershipGuest(record.status);

  return {
    isGuest,
    currentPlan: formatMembershipPlanLabel(record.currentPlanId),
    status: record.status,
    expiryDate: formatExpiryDate(record.expiryDate),
    daysRemaining: formatDaysRemaining(record.daysRemaining),
    daysRemainingValue: record.daysRemaining,
    planDurationDays: getPlanDurationDays(record.currentPlanId),
    availablePlans: buildAvailablePlans(record.currentPlanId),
  };
}
