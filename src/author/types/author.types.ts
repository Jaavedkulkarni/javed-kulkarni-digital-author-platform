import type { Tables } from '../../types/database';

export type AuthorProfile = Tables<'authors'>;

export interface AuthorContext {
  authorId: string;
  profileId: string;
  displayName: string;
  slug: string;
}

export interface UpdateAuthorProfileInput {
  displayName?: string;
  legalName?: string | null;
  bio?: string | null;
  shortBio?: string | null;
  websiteUrl?: string | null;
  socialLinks?: Record<string, string>;
  avatarStoragePath?: string | null;
  coverStoragePath?: string | null;
}
