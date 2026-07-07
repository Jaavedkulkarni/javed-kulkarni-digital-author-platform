import { createStorageService } from '../../lib/storage/storageService';
import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { STORAGE_BUCKETS } from '../../lib/storage/buckets';

export type StorageAssetKind = 'avatar' | 'book_cover' | 'publisher_logo' | 'document' | 'media';

export interface StorageAssetDescriptor {
  kind: StorageAssetKind;
  bucket: string;
  path: string;
  public: boolean;
  version?: number;
}

export interface FileStorageUploadInput {
  kind: StorageAssetKind;
  bucket: string;
  folder: string;
  file: File;
  filename?: string;
  upsert?: boolean;
}

const BUCKET_BY_KIND: Record<StorageAssetKind, string> = {
  avatar: STORAGE_BUCKETS.AVATARS,
  book_cover: STORAGE_BUCKETS.BOOK_COVERS,
  publisher_logo: STORAGE_BUCKETS.PUBLISHER_ASSETS,
  document: STORAGE_BUCKETS.BOOK_FILES,
  media: STORAGE_BUCKETS.MEDIA,
};

export class FileStorageService {
  constructor(private readonly client: TypedSupabaseClient) {}

  resolveBucket(kind: StorageAssetKind): string {
    return BUCKET_BY_KIND[kind];
  }

  async upload(input: FileStorageUploadInput) {
    const storage = createStorageService(this.client);
    return storage.upload(input.file, {
      bucket: input.bucket || this.resolveBucket(input.kind),
      folder: input.folder,
      filename: input.filename,
      upsert: input.upsert,
      contentType: input.file.type,
    });
  }

  async remove(kind: StorageAssetKind, paths: string[]) {
    const storage = createStorageService(this.client);
    return storage.remove(this.resolveBucket(kind), paths);
  }

  getPublicUrl(kind: StorageAssetKind, path: string): string {
    const storage = createStorageService(this.client);
    return storage.getPublicUrl(this.resolveBucket(kind), path);
  }

  async signUrl(kind: StorageAssetKind, path: string, expiresIn?: number) {
    const storage = createStorageService(this.client);
    return storage.signUrl(this.resolveBucket(kind), path, expiresIn);
  }
}

export function createFileStorageService(client: TypedSupabaseClient): FileStorageService {
  return new FileStorageService(client);
}
