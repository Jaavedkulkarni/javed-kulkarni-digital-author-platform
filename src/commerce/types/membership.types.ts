import type { MembershipStatus, MembershipTier } from '../../types/database';
import type { CommerceCurrency } from './common';

export interface CommerceMembership {
  id: string;
  userId: string;
  tier: MembershipTier;
  status: MembershipStatus;
  billingCycle: string | null;
  pricePaid: number | null;
  currency: CommerceCurrency;
  autoRenew: boolean;
  trialEndsAt: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelledAt: string | null;
  providerSubscriptionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MembershipContext {
  userId: string;
  tier: MembershipTier | null;
  isActive: boolean;
  membership: CommerceMembership | null;
}
