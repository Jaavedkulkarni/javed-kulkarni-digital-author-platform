import type { PlatformAdminProfileRepository } from '../repositories/profileRepository';
import type { PlatformAdminContext } from '../types/department.types';
import { getAdminDepartments, getAdminPermissions } from '../stores/adminStore';
import { canAccessPlatformAdmin } from '../utils/security';
import type { SystemRole } from '../../types/roles';

export class PlatformAdminContextService {
  constructor(private readonly profileRepo: PlatformAdminProfileRepository) {}

  async resolveContext(profileId: string, roles: SystemRole[]): Promise<PlatformAdminContext | null> {
    if (!canAccessPlatformAdmin(roles)) return null;
    const profile = await this.profileRepo.findByProfileId(profileId);
    if (!profile) return null;
    const departments = getAdminDepartments(profileId);
    return {
      adminId: profileId,
      profileId,
      displayName: profile.full_name ?? profile.email,
      departments,
      permissions: getAdminPermissions(profileId),
    };
  }
}

export function createPlatformAdminContextService(
  repo: PlatformAdminProfileRepository
): PlatformAdminContextService {
  return new PlatformAdminContextService(repo);
}
