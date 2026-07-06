import type { AuthorProfileRepository } from '../repositories/authorRepository';
import type { AuthorContext, AuthorProfile } from '../types/author.types';

export class AuthorContextService {
  constructor(private readonly profileRepo: AuthorProfileRepository) {}

  async resolveContext(profileId: string): Promise<AuthorContext | null> {
    const author = await this.profileRepo.findByProfileId(profileId);
    if (!author) return null;
    return {
      authorId: author.id,
      profileId: author.profile_id ?? profileId,
      displayName: author.display_name,
      slug: author.slug,
    };
  }

  async getProfile(authorId: string): Promise<AuthorProfile | null> {
    return this.profileRepo.findById(authorId);
  }
}

export function createAuthorContextService(repo: AuthorProfileRepository): AuthorContextService {
  return new AuthorContextService(repo);
}
