import { isForbiddenAction } from '../utils/security';

export class PlatformAdminSecurityService {
  canPerform(action: string): boolean {
    return !isForbiddenAction(action);
  }

  getForbiddenActions(): string[] {
    return ['super_admin', 'publisher_approval', 'platform_settings', 'user_role_management', 'infrastructure', 'feature_flags'];
  }
}

export function createPlatformAdminSecurityService(): PlatformAdminSecurityService {
  return new PlatformAdminSecurityService();
}
