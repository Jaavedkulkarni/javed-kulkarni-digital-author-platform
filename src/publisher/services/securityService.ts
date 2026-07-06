import { isForbiddenResource, assertPublisherOwnership } from '../utils/security';
import type { ForbiddenPublisherResource } from '../utils/security';

export class PublisherSecurityService {
  canAccessResource(resource: string): boolean {
    return !isForbiddenResource(resource);
  }

  assertOwnership(resourcePublisherId: string, publisherId: string): boolean {
    return assertPublisherOwnership(resourcePublisherId, publisherId);
  }

  getForbiddenResources(): ForbiddenPublisherResource[] {
    return [
      'reader_data',
      'author_dashboard',
      'author_earnings',
      'other_publishers',
      'platform_analytics',
      'cms',
      'commerce_admin',
      'mindwave_ai',
      'platform_settings',
    ];
  }
}

export function createPublisherSecurityService(): PublisherSecurityService {
  return new PublisherSecurityService();
}
