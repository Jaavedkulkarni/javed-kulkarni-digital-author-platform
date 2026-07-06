import type { AuthorService } from '../../cms/services/authorService';
import type { UpdateAuthorProfileInput } from '../types/author.types';
import { validateAuthorProfileUpdate } from '../validators/profileValidator';

export class AuthorProfileService {
  constructor(private readonly cmsAuthors: AuthorService) {}

  async getProfile(authorId: string) {
    return this.cmsAuthors.getById(authorId);
  }

  async update(authorId: string, input: UpdateAuthorProfileInput) {
    const validation = validateAuthorProfileUpdate(input);
    if (!validation.valid) return { errors: validation.errors };

    return this.cmsAuthors.update(authorId, {
      displayName: input.displayName,
      legalName: input.legalName,
      bio: input.bio,
      shortBio: input.shortBio,
      websiteUrl: input.websiteUrl,
      socialLinks: input.socialLinks,
      avatarStoragePath: input.avatarStoragePath,
    });
  }
}

export function createAuthorProfileService(cmsAuthors: AuthorService): AuthorProfileService {
  return new AuthorProfileService(cmsAuthors);
}
