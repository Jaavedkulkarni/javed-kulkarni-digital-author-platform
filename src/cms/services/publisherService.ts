import type { Json, TablesInsert, TablesUpdate } from '../../types/database';
import type { CmsPublisherRepository } from '../repositories/publisherRepository';
import type {
  CreatePublisherInput,
  CmsPublisher,
  PublisherAddress,
  PublisherListFilters,
  PublisherSettings,
  UpdatePublisherInput,
} from '../types/publisher.types';
import { mapPublisherRow as mapPublisher } from '../types/publisher.types';
import { validateCreatePublisher, validateUpdatePublisher } from '../validators/publisherValidator';
import { ensureUniqueSlug, slugifyText } from '../utils/slug';

function toPublisherAddressJson(
  address?: PublisherAddress,
  settings?: PublisherSettings
): Json | undefined {
  if (!address && !settings) return undefined;
  return { ...address, settings } as Json;
}

export class PublisherService {
  constructor(private readonly repo: CmsPublisherRepository) {}

  async getById(id: string): Promise<CmsPublisher | null> {
    const row = await this.repo.findById(id);
    return row ? mapPublisher(row) : null;
  }

  async list(filters: PublisherListFilters = {}) {
    return (await this.repo.findByFilters(filters)).map(mapPublisher);
  }

  async create(input: CreatePublisherInput): Promise<{ publisher?: CmsPublisher; errors?: string[] }> {
    const validation = validateCreatePublisher(input);
    if (!validation.valid) return { errors: validation.errors };

    const slugs = await this.repo.getAllSlugs();
    const slug = input.slug ? slugifyText(input.slug) : ensureUniqueSlug(input.name, slugs);

    const payload: TablesInsert<'publishers'> = {
      name: input.name.trim(),
      slug,
      legal_name: input.legalName ?? null,
      description: input.description ?? null,
      profile_id: input.profileId ?? null,
      website_url: input.websiteUrl ?? null,
      contact_email: input.contactEmail ?? null,
      contact_phone: input.contactPhone ?? null,
      address: toPublisherAddressJson(input.address, input.settings) ?? {},
      logo_storage_path: input.logoStoragePath ?? null,
      is_verified: input.isVerified ?? false,
      status: 'active',
    };

    const row = await this.repo.insertPublisher(payload);
    return { publisher: mapPublisher(row) };
  }

  async update(id: string, input: UpdatePublisherInput): Promise<{ publisher?: CmsPublisher; errors?: string[] }> {
    const validation = validateUpdatePublisher(input);
    if (!validation.valid) return { errors: validation.errors };

    const payload: TablesUpdate<'publishers'> = {};
    if (input.name !== undefined) payload.name = input.name.trim();
    if (input.slug !== undefined) payload.slug = slugifyText(input.slug);
    if (input.description !== undefined) payload.description = input.description;
    if (input.contactEmail !== undefined) payload.contact_email = input.contactEmail;
    if (input.contactPhone !== undefined) payload.contact_phone = input.contactPhone;
    if (input.logoStoragePath !== undefined) payload.logo_storage_path = input.logoStoragePath;
    if (input.isVerified !== undefined) payload.is_verified = input.isVerified;
    if (input.address || input.settings) {
      payload.address = toPublisherAddressJson(input.address, input.settings);
    }

    const row = await this.repo.patchPublisher(id, payload);
    return { publisher: mapPublisher(row) };
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}

export function createPublisherService(repo: CmsPublisherRepository): PublisherService {
  return new PublisherService(repo);
}
