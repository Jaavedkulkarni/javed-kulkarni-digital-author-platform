import type { StorageClient } from '../supabase/storage/storageClient';
import { normalizeSupabaseError } from '../utils/errors';
import { withRetry } from '../utils/retry';
import { DEFAULT_SIGNED_URL_TTL_SECONDS } from './buckets';

export interface SignedUrlResult {
  path: string;
  signedUrl: string;
  expiresIn: number;
}

export async function createSignedUrl(
  storage: StorageClient,
  bucket: string,
  path: string,
  expiresIn = DEFAULT_SIGNED_URL_TTL_SECONDS
): Promise<SignedUrlResult> {
  const result = await withRetry(async () =>
    storage.createSignedUrl(bucket, path, expiresIn)
  );

  if (result.error || !result.data?.signedUrl) {
    throw normalizeSupabaseError(result.error ?? new Error('Failed to create signed URL'), 'storage');
  }

  return {
    path,
    signedUrl: result.data.signedUrl,
    expiresIn,
  };
}

export async function createSignedUrls(
  storage: StorageClient,
  bucket: string,
  paths: string[],
  expiresIn = DEFAULT_SIGNED_URL_TTL_SECONDS
): Promise<SignedUrlResult[]> {
  if (paths.length === 0) return [];

  const result = await withRetry(async () =>
    storage.createSignedUrls(bucket, paths, expiresIn)
  );

  if (result.error) {
    throw normalizeSupabaseError(result.error, 'storage');
  }

  return (result.data ?? [])
    .filter((item) => Boolean(item.signedUrl))
    .map((item) => ({
      path: item.path ?? '',
      signedUrl: item.signedUrl as string,
      expiresIn,
    }));
}

export function getPublicAssetUrl(
  storage: StorageClient,
  bucket: string,
  path: string
): string {
  const { data } = storage.getPublicUrl(bucket, path);
  return data.publicUrl;
}
