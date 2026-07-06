import type { AuthorService } from '../../cms/services/authorService';
import type { RoleService } from './roleService';
import type { VerificationService } from './verificationService';
import type { OrganizationOperationResult } from '../types/common';
import type { SystemRole } from '../../types/roles';
import { isAuthor } from '../../lib/permissions';

export interface BecomeAuthorInput {
  userId: string;
  displayName: string;
}

export class OnboardingService {
  constructor(
    private readonly roles: RoleService,
    private readonly cmsAuthors: AuthorService,
    private readonly verification: VerificationService
  ) {}

  async becomeAuthor(input: BecomeAuthorInput): Promise<OrganizationOperationResult> {
    const existingRoles = await this.roles.getUserRoles(input.userId);
    if (isAuthor(existingRoles)) {
      return { success: false, errors: ['You already have author access.'] };
    }

    const authorResult = await this.cmsAuthors.create({
      displayName: input.displayName.trim(),
      profileId: input.userId,
    });
    if (authorResult.errors?.length) {
      return { success: false, errors: authorResult.errors };
    }

    const roleResult = await this.roles.assignRole(input.userId, 'author' as SystemRole, input.userId);
    if (!roleResult.success) return roleResult;

    await this.verification.transitionAuthorVerification(input.userId, 'verified', input.userId);
    return { success: true, data: authorResult.author };
  }
}

export function createOnboardingService(
  roles: RoleService,
  cmsAuthors: AuthorService,
  verification: VerificationService
): OnboardingService {
  return new OnboardingService(roles, cmsAuthors, verification);
}
