export function assertPublisherOwnership(
  resourcePublisherId: string,
  publisherId: string
): boolean {
  return resourcePublisherId === publisherId;
}

export const FORBIDDEN_PUBLISHER_RESOURCES = [
  'reader_data',
  'author_dashboard',
  'author_earnings',
  'other_publishers',
  'platform_analytics',
  'cms',
  'commerce_admin',
  'mindwave_ai',
  'platform_settings',
] as const;

export type ForbiddenPublisherResource = (typeof FORBIDDEN_PUBLISHER_RESOURCES)[number];

export function isForbiddenResource(resource: string): resource is ForbiddenPublisherResource {
  return (FORBIDDEN_PUBLISHER_RESOURCES as readonly string[]).includes(resource);
}
