import type { CommerceMembershipRepository } from '../repositories/membershipRepository';
import type { MembershipContext, CommerceMembership } from '../types/membership.types';
import type { CommerceOperationResult } from '../types/common';

export class MembershipService {
  constructor(private readonly repo: CommerceMembershipRepository) {}

  async getByUser(userId: string): Promise<CommerceMembership | null> {
    return this.repo.findByUser(userId);
  }

  async getActiveByUser(userId: string): Promise<CommerceMembership | null> {
    return this.repo.findActiveByUser(userId);
  }

  async getContext(userId: string): Promise<MembershipContext> {
    const membership = await this.repo.findActiveByUser(userId);
    return {
      userId,
      tier: this.repo.getActiveTier(membership),
      isActive: Boolean(membership),
      membership,
    };
  }

  async hasActiveMembership(userId: string): Promise<boolean> {
    const membership = await this.repo.findActiveByUser(userId);
    return Boolean(membership);
  }

  async createMembership(
    payload: Parameters<CommerceMembershipRepository['createMembership']>[0]
  ): Promise<CommerceOperationResult<CommerceMembership>> {
    try {
      const membership = await this.repo.createMembership(payload);
      return { success: true, data: membership };
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Membership creation failed.'],
      };
    }
  }
}

export function createMembershipService(repo: CommerceMembershipRepository): MembershipService {
  return new MembershipService(repo);
}
