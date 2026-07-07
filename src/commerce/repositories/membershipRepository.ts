import type { Membership, MembershipStatus, MembershipTier, TablesInsert } from '../../types/database';
import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import { eq } from '../../lib/utils/filters';
import type { CommerceMembership } from '../types/membership.types';

function mapMembership(row: Membership): CommerceMembership {
  return {
    id: row.id,
    userId: row.user_id,
    tier: row.tier,
    status: row.status,
    billingCycle: row.billing_cycle,
    pricePaid: row.price_paid,
    currency: (row.currency as CommerceMembership['currency']) ?? 'INR',
    autoRenew: row.auto_renew,
    trialEndsAt: row.trial_ends_at,
    currentPeriodStart: row.current_period_start,
    currentPeriodEnd: row.current_period_end,
    cancelledAt: row.cancelled_at,
    providerSubscriptionId: row.provider_subscription_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const ACTIVE_STATUSES: MembershipStatus[] = ['active', 'trialing'];

export class CommerceMembershipRepository extends BaseRepository<'memberships'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'memberships', { softDelete: true });
  }

  async findByUser(userId: string): Promise<CommerceMembership | null> {
    const rows = await this.findMany({
      filters: { conditions: [eq('user_id', userId)], match: 'all' },
      sort: { sortBy: 'created_at', sortDirection: 'desc' },
      pagination: { page: 1, pageSize: 1 },
    });
    return rows[0] ? mapMembership(rows[0]) : null;
  }

  async findActiveByUser(userId: string): Promise<CommerceMembership | null> {
    const membership = await this.findByUser(userId);
    if (!membership) return null;
    return ACTIVE_STATUSES.includes(membership.status) ? membership : null;
  }

  async createMembership(payload: TablesInsert<'memberships'>): Promise<CommerceMembership> {
    const row = await this.create(payload);
    return mapMembership(row);
  }

  async updateMembership(id: string, payload: Partial<TablesInsert<'memberships'>>): Promise<CommerceMembership> {
    const row = await this.update(id, payload);
    return mapMembership(row);
  }

  getActiveTier(membership: CommerceMembership | null): MembershipTier | null {
    if (!membership || !ACTIVE_STATUSES.includes(membership.status)) return null;
    return membership.tier;
  }
}

export function createCommerceMembershipRepository(client: TypedSupabaseClient): CommerceMembershipRepository {
  return new CommerceMembershipRepository(client);
}
