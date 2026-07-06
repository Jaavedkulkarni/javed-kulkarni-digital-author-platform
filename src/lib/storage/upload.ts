import type { StorageClient } from '../supabase/storage/storageClient';
import { normalizeSupabaseError } from '../utils/errors';
import { withRetry } from '../utils/retry';
import { sanitizeStorageFilename } from './buckets';

export interface UploadFileOptions {
  bucket: string;
  folder?: string;
  filename?: string;
  cacheControl?: string;
  contentType?: string;
  upsert?: boolean;
}

export interface UploadFileResult {
  bucket: string;
  path: string;
  fullPath: string;
}

export function resolveStoragePath(folder: string | undefined, filename: string): string {
  return folder ? `${folder.replace(/\/$/, '')}/${filename}` : filename;
}

export async function uploadFile(
  storage: StorageClient,
  file: File | Blob,
  options: UploadFileOptions
): Promise<UploadFileResult> {
  const filename = options.filename ?? sanitizeStorageFilename(
    file instanceof File ? file.name : 'upload.bin'
  );
  const path = resolveStoragePath(options.folder, filename);

  const result = await withRetry(async () =>
    storage.upload(options.bucket, path, file, {
      cacheControl: options.cacheControl ?? '3600',
      contentType: options.contentType ?? (file instanceof File ? file.type : undefined),
      upsert: options.upsert ?? false,
    })
  );

  if (result.error) {
    throw normalizeSupabaseError(result.error, 'storage');
  }

  return {
    bucket: options.bucket,
    path,
    fullPath: result.data?.path ?? path,
  };
}

export async function uploadFiles(
  storage: StorageClient,
  files: Array<{ file: File | Blob; options: UploadFileOptions }>
): Promise<UploadFileResult[]> {
  const uploads = files.map(({ file, options }) => uploadFile(storage, file, options));
  return Promise.all(uploads);
}

export async function removeFiles(
  storage: StorageClient,
  bucket: string,
  paths: string[]
): Promise<void> {
  if (paths.length === 0) return;

  const result = await withRetry(async () => storage.remove(bucket, paths));

  if (result.error) {
    throw normalizeSupabaseError(result.error, 'storage');
  }
}
