import { STORAGE_BUCKETS } from '../../lib/storage/buckets';
import { getMediaAssets, addMediaAsset, removeMediaAsset } from '../stores/mediaStore';
import type { MediaAsset, UploadMediaInput } from '../types/media.types';

export class AuthorMediaService {
  list(authorId: string): MediaAsset[] {
    return getMediaAssets(authorId);
  }

  registerUpload(input: UploadMediaInput): MediaAsset {
    const asset: MediaAsset = {
      id: `media_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      authorId: input.authorId,
      filename: input.filename,
      storagePath: input.storagePath,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      bucket: input.bucket ?? STORAGE_BUCKETS.AUTHOR_ASSETS,
      uploadedAt: new Date().toISOString(),
    };
    addMediaAsset(asset);
    return asset;
  }

  remove(authorId: string, assetId: string): void {
    removeMediaAsset(authorId, assetId);
  }

  buildStoragePath(authorId: string, filename: string): string {
    return `${authorId}/${filename}`;
  }
}

export function createAuthorMediaService(): AuthorMediaService {
  return new AuthorMediaService();
}
