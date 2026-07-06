import type { SuperAdminProfileRepository } from '../repositories/profileRepository';
import type { SuperAdminContext } from '../types/context.types';
import type { SystemRole } from '../../types/roles';
import { canAccessSuperAdmin, isPrimarySuperAdmin } from '../security/accessControl';

export class SuperAdminContextService {
  constructor(private readonly profileRepo: SuperAdminProfileRepository) {}

  async resolveContext(profileId: string, roles: SystemRole[]): Promise<SuperAdminContext | null> {
    if (!canAccessSuperAdmin(roles)) return null;
    const profile = await this.profileRepo.findByProfileId(profileId);
    if (!profile) return null;
    return {
      superAdminId: profileId,
      profileId,
      displayName: profile.full_name ?? profile.email,
      email: profile.email,
      isPrimarySuperAdmin: isPrimarySuperAdmin(profile.email, roles),
    };
  }
}

export function createSuperAdminContextService(repo: SuperAdminProfileRepository): SuperAdminContextService {
  return new SuperAdminContextService(repo);
}
