import type { SupabaseClient } from '@supabase/supabase-js';
import type { TypedSupabaseClient } from '../clients/browser';

export class StorageClient {
  constructor(private readonly client: TypedSupabaseClient) {}

  get storage() {
    return this.client.storage;
  }

  from(bucket: string) {
    return this.client.storage.from(bucket);
  }

  async listBuckets() {
    return this.client.storage.listBuckets();
  }

  getPublicUrl(bucket: string, path: string) {
    return this.client.storage.from(bucket).getPublicUrl(path);
  }

  async createSignedUrl(bucket: string, path: string, expiresIn: number) {
    return this.client.storage.from(bucket).createSignedUrl(path, expiresIn);
  }

  async createSignedUrls(bucket: string, paths: string[], expiresIn: number) {
    return this.client.storage.from(bucket).createSignedUrls(paths, expiresIn);
  }

  async upload(bucket: string, path: string, file: File | Blob | ArrayBuffer, options?: {
    cacheControl?: string;
    contentType?: string;
    upsert?: boolean;
  }) {
    return this.client.storage.from(bucket).upload(path, file, options);
  }

  async download(bucket: string, path: string) {
    return this.client.storage.from(bucket).download(path);
  }

  async remove(bucket: string, paths: string[]) {
    return this.client.storage.from(bucket).remove(paths);
  }

  async move(bucket: string, fromPath: string, toPath: string) {
    return this.client.storage.from(bucket).move(fromPath, toPath);
  }

  async list(bucket: string, path?: string, options?: {
    limit?: number;
    offset?: number;
    sortBy?: { column: string; order: 'asc' | 'desc' };
  }) {
    return this.client.storage.from(bucket).list(path, options);
  }
}

export function createStorageClient(client: SupabaseClient): StorageClient {
  return new StorageClient(client as TypedSupabaseClient);
}
