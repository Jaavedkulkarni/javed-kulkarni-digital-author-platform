import type { Tables } from '../../types/database';

export interface CreateAuthorInput {
  displayName: string;
  slug?: string;
  legalName?: string | null;
  bio?: string | null;
  shortBio?: string | null;
  profileId?: string | null;
  websiteUrl?: string | null;
  socialLinks?: Record<string, string>;
  avatarStoragePath?: string | null;
  isVerified?: boolean;
  isFeatured?: boolean;
}

export type UpdateAuthorInput = Partial<CreateAuthorInput>;

export interface AuthorListFilters {
  search?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  status?: string;
}

export type CmsAuthor = Tables<'authors'>;

export function mapAuthorRow(row: Tables<'authors'>): CmsAuthor {
  return row;
}
