import type { MembershipPlanId, MembershipStatus } from '../components/membership/membershipTypes';

export type MembershipScenario = 'guest' | 'active' | 'expired';

/** Switch scenario locally to preview Guest / Active / Expired UI states. */
export const MOCK_MEMBERSHIP_SCENARIO: MembershipScenario = 'guest';

export interface MockMembershipRecord {
  currentPlanId: MembershipPlanId;
  status: MembershipStatus;
  expiryDate: string | null;
  daysRemaining: number | null;
}

export const MOCK_MEMBERSHIP_BY_SCENARIO: Record<MembershipScenario, MockMembershipRecord> = {
  guest: {
    currentPlanId: 'free',
    status: 'none',
    expiryDate: null,
    daysRemaining: null,
  },
  active: {
    currentPlanId: 'yearly',
    status: 'active',
    expiryDate: '31 Dec 2026',
    daysRemaining: 183,
  },
  expired: {
    currentPlanId: 'monthly',
    status: 'expired',
    expiryDate: '01 Jun 2025',
    daysRemaining: 0,
  },
};

export function getMockMembershipRecord(): MockMembershipRecord {
  return MOCK_MEMBERSHIP_BY_SCENARIO[MOCK_MEMBERSHIP_SCENARIO];
}
