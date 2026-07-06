import type { Tables } from '../../types/database';

export interface PublisherAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface PublisherSettings {
  defaultCurrency?: string;
  defaultLanguage?: string;
  allowPreorders?: boolean;
  autoPublish?: boolean;
}

export interface CreatePublisherInput {
  name: string;
  slug?: string;
  legalName?: string | null;
  description?: string | null;
  profileId?: string | null;
  websiteUrl?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  address?: PublisherAddress;
  logoStoragePath?: string | null;
  isVerified?: boolean;
  settings?: PublisherSettings;
}

export type UpdatePublisherInput = Partial<CreatePublisherInput>;

export interface PublisherListFilters {
  search?: string;
  isVerified?: boolean;
  status?: string;
}

export type CmsPublisher = Tables<'publishers'>;

export function mapPublisherRow(row: Tables<'publishers'>): CmsPublisher {
  return row;
}
