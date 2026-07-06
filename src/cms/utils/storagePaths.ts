import {
  STORAGE_BUCKETS,
  buildAuthorAssetPath,
  buildBookCoverPath,
  buildBookFilePath,
  buildPublisherAssetPath,
} from '../../lib/storage/buckets';
import type { DigitalFormat } from '../../types/database';

export const CMS_STORAGE_BUCKETS = STORAGE_BUCKETS;

export function resolveBookCoverPath(bookId: string, filename = 'cover.webp'): string {
  return buildBookCoverPath(bookId, filename);
}

export function resolveBookEditionPath(bookId: string, format: DigitalFormat): string {
  return buildBookFilePath(bookId, format);
}

export function resolveAuthorAvatarPath(authorId: string, filename = 'avatar.webp'): string {
  return buildAuthorAssetPath(authorId, filename);
}

export function resolvePublisherLogoPath(publisherId: string, filename = 'logo.webp'): string {
  return buildPublisherAssetPath(publisherId, filename);
}

export function resolveBookCoverPublicUrl(getPublicUrl: (bucket: string, path: string) => string, bookId: string) {
  return getPublicUrl(STORAGE_BUCKETS.BOOK_COVERS, resolveBookCoverPath(bookId));
}

export interface CmsStorageIntegration {
  getPublicUrl: (bucket: string, path: string) => string;
  signUrl: (bucket: string, path: string, expiresIn?: number) => Promise<string>;
}

export function createStorageIntegrationPlaceholder(): CmsStorageIntegration {
  return {
    getPublicUrl: (bucket, path) => `storage://${bucket}/${path}`,
    signUrl: async (bucket, path) => `signed://${bucket}/${path}`,
  };
}
