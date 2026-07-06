import { createStorageClient, type StorageClient } from '../supabase/storage/storageClient';
import type { TypedSupabaseClient } from '../supabase/clients/browser';
import { logger } from '../utils/logger';
import { STORAGE_BUCKETS } from './buckets';
import { uploadFile, uploadFiles, removeFiles, type UploadFileOptions, type UploadFileResult } from './upload';
import { createSignedUrl, createSignedUrls, getPublicAssetUrl, type SignedUrlResult } from './signedUrl';

export class StorageService {
  private readonly storage: StorageClient;

  constructor(client: TypedSupabaseClient) {
    this.storage = createStorageClient(client);
  }

  getBuckets() {
    return STORAGE_BUCKETS;
  }

  getClient(): StorageClient {
    return this.storage;
  }

  async listBuckets() {
    const result = await this.storage.listBuckets();

    if (result.error) {
      logger.error('storage', result.error.message);
      throw result.error;
    }

    return result.data;
  }

  async list(bucket: string, path?: string) {
    return this.storage.list(bucket, path);
  }

  async upload(file: File | Blob, options: UploadFileOptions): Promise<UploadFileResult> {
    return uploadFile(this.storage, file, options);
  }

  async uploadMany(files: Array<{ file: File | Blob; options: UploadFileOptions }>) {
    return uploadFiles(this.storage, files);
  }

  async remove(bucket: string, paths: string[]) {
    return removeFiles(this.storage, bucket, paths);
  }

  async signUrl(bucket: string, path: string, expiresIn?: number): Promise<SignedUrlResult> {
    return createSignedUrl(this.storage, bucket, path, expiresIn);
  }

  async signUrls(bucket: string, paths: string[], expiresIn?: number): Promise<SignedUrlResult[]> {
    return createSignedUrls(this.storage, bucket, paths, expiresIn);
  }

  getPublicUrl(bucket: string, path: string): string {
    return getPublicAssetUrl(this.storage, bucket, path);
  }

  async download(bucket: string, path: string) {
    return this.storage.download(bucket, path);
  }
}

export function createStorageService(client: TypedSupabaseClient): StorageService {
  return new StorageService(client);
}
