import type { MembershipPlanId, MembershipStatus } from '../../components/membership/membershipTypes';
import type { MembershipStatus as DbMembershipStatus, MembershipTier, Tables } from '../../types/database';
import type { MockMembershipRecord } from '../../data/mockMembership';

function mapTierToPlanId(tier: MembershipTier): MembershipPlanId {
  if (tier === 'lifetime') return 'lifetime';
  if (tier === 'premium') return 'yearly';
  if (tier === 'basic') return 'monthly';
  return 'free';
}

function mapDbStatusToUiStatus(status: DbMembershipStatus): MembershipStatus {
  if (status === 'active' || status === 'trial') return 'active';
  if (status === 'expired' || status === 'cancelled' || status === 'paused') return 'expired';
  return 'none';
}

function formatExpiryLabel(date: string | null): string | null {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function daysUntil(date: string | null): number | null {
  if (!date) return null;
  const target = new Date(date).getTime();
  if (Number.isNaN(target)) return null;
  const diff = target - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function mapMembershipToMockRecord(
  membership: Tables<'memberships'> | null
): MockMembershipRecord {
  if (!membership) {
    return { currentPlanId: 'free', status: 'none', expiryDate: null, daysRemaining: null };
  }

  const uiStatus = mapDbStatusToUiStatus(membership.status);
  const expiry = membership.current_period_end;

  return {
    currentPlanId: mapTierToPlanId(membership.tier),
    status: uiStatus,
    expiryDate: formatExpiryLabel(expiry),
    daysRemaining: uiStatus === 'active' ? daysUntil(expiry) : 0,
  };
}
