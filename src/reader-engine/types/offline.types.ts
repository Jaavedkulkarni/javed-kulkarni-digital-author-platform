import type { DigitalFormat } from '../../types/database';

export type OfflineCacheStatus = 'queued' | 'downloading' | 'ready' | 'expired' | 'failed';

export interface OfflineCacheEntry {
  bookId: string;
  format: DigitalFormat;
  status: OfflineCacheStatus;
  storagePath: string | null;
  cachedAt: string | null;
  expiresAt: string | null;
  fileSizeBytes: number | null;
}

export interface DownloadBookInput {
  userId: string;
  bookId: string;
  format: DigitalFormat;
  wifiOnly?: boolean;
  deviceId?: string;
}

export interface OfflineSyncQueueItem {
  id: string;
  entityType: string;
  payload: Record<string, unknown>;
  queuedAt: string;
  retryCount: number;
}
