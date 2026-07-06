import type { PublisherProfileRepository } from '../repositories/publisherRepository';
import type { PublisherContext } from '../types/context.types';

export class PublisherContextService {
  constructor(private readonly profileRepo: PublisherProfileRepository) {}

  async resolveContext(profileId: string): Promise<PublisherContext | null> {
    const publisher = await this.profileRepo.findByProfileId(profileId);
    if (!publisher) return null;
    return {
      publisherId: publisher.id,
      profileId: publisher.profile_id ?? profileId,
      companyName: publisher.name,
      slug: publisher.slug,
    };
  }
}

export function createPublisherContextService(
  repo: PublisherProfileRepository
): PublisherContextService {
  return new PublisherContextService(repo);
}
