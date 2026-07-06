import type { TablesInsert, TablesUpdate } from '../../types/database';
import type { CmsAuthorRepository } from '../repositories/authorRepository';
import type { CreateAuthorInput, CmsAuthor, UpdateAuthorInput } from '../types/author.types';
import { mapAuthorRow as mapAuthor } from '../types/author.types';
import { validateCreateAuthor, validateUpdateAuthor } from '../validators/authorValidator';
import { ensureUniqueSlug, slugifyText } from '../utils/slug';
import type { AuthorListFilters } from '../types/author.types';

export class AuthorService {
  constructor(private readonly repo: CmsAuthorRepository) {}

  async getById(id: string): Promise<CmsAuthor | null> {
    const row = await this.repo.findById(id);
    return row ? mapAuthor(row) : null;
  }

  async getBySlug(slug: string): Promise<CmsAuthor | null> {
    const row = await this.repo.findBySlug(slug);
    return row ? mapAuthor(row) : null;
  }

  async list(filters: AuthorListFilters = {}) {
    const rows = await this.repo.findByFilters(filters);
    return rows.map(mapAuthor);
  }

  async create(input: CreateAuthorInput): Promise<{ author?: CmsAuthor; errors?: string[] }> {
    const validation = validateCreateAuthor(input);
    if (!validation.valid) return { errors: validation.errors };

    const slugs = await this.repo.getAllSlugs();
    const slug = input.slug ? slugifyText(input.slug) : ensureUniqueSlug(input.displayName, slugs);

    const payload: TablesInsert<'authors'> = {
      display_name: input.displayName.trim(),
      slug,
      legal_name: input.legalName ?? null,
      bio: input.bio ?? null,
      short_bio: input.shortBio ?? null,
      profile_id: input.profileId ?? null,
      website_url: input.websiteUrl ?? null,
      social_links: input.socialLinks ?? {},
      avatar_storage_path: input.avatarStoragePath ?? null,
      is_verified: input.isVerified ?? false,
      is_featured: input.isFeatured ?? false,
      status: 'active',
    };

    const row = await this.repo.insertAuthor(payload);
    return { author: mapAuthor(row) };
  }

  async update(id: string, input: UpdateAuthorInput): Promise<{ author?: CmsAuthor; errors?: string[] }> {
    const validation = validateUpdateAuthor(input);
    if (!validation.valid) return { errors: validation.errors };

    const payload: TablesUpdate<'authors'> = {};
    if (input.displayName !== undefined) payload.display_name = input.displayName.trim();
    if (input.slug !== undefined) payload.slug = slugifyText(input.slug);
    if (input.legalName !== undefined) payload.legal_name = input.legalName;
    if (input.bio !== undefined) payload.bio = input.bio;
    if (input.shortBio !== undefined) payload.short_bio = input.shortBio;
    if (input.websiteUrl !== undefined) payload.website_url = input.websiteUrl;
    if (input.socialLinks !== undefined) payload.social_links = input.socialLinks;
    if (input.avatarStoragePath !== undefined) payload.avatar_storage_path = input.avatarStoragePath;
    if (input.isVerified !== undefined) payload.is_verified = input.isVerified;
    if (input.isFeatured !== undefined) payload.is_featured = input.isFeatured;

    const row = await this.repo.patchAuthor(id, payload);
    return { author: mapAuthor(row) };
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async verify(id: string): Promise<CmsAuthor> {
    const row = await this.repo.patchAuthor(id, { is_verified: true });
    return mapAuthor(row);
  }
}

export function createAuthorService(repo: CmsAuthorRepository): AuthorService {
  return new AuthorService(repo);
}
