import type { RoleService } from './roleService';
import type { VerificationService } from './verificationService';
import type { OnboardingRepository } from '../repositories/onboardingRepository';
import type { OrganizationOperationResult } from '../types/common';
import { isAuthor } from '../../lib/permissions';
import { getErrorMessage } from '../../lib/utils/errors';

export interface BecomeAuthorInput {
  userId: string;
  displayName: string;
}

export interface BecomeAuthorResult {
  authorId: string;
}

export class OnboardingService {
  constructor(
    private readonly roles: RoleService,
    private readonly onboardingRepo: OnboardingRepository,
    private readonly verification: VerificationService
  ) {}

  async becomeAuthor(input: BecomeAuthorInput): Promise<OrganizationOperationResult<BecomeAuthorResult>> {
    try {
      const existingRoles = await this.roles.getUserRoles(input.userId);
      if (isAuthor(existingRoles)) {
        return { success: false, errors: ['You already have author access.'] };
      }

      const authorId = await this.onboardingRepo.becomeAuthor(input.displayName.trim());

      await this.verification.transitionAuthorVerification(input.userId, 'verified', input.userId);

      return { success: true, data: { authorId } };
    } catch (error) {
      return { success: false, errors: [getErrorMessage(error)] };
    }
  }
}

export function createOnboardingService(
  roles: RoleService,
  onboardingRepo: OnboardingRepository,
  verification: VerificationService
): OnboardingService {
  return new OnboardingService(roles, onboardingRepo, verification);
}
