import type { EngineDownloadRepository } from '../repositories/downloadRepository';
import type { DigitalFormat } from '../../types/database';
import type { DownloadBookInput, OfflineCacheEntry, OfflineSyncQueueItem } from '../types/offline.types';
import { OFFLINE_CACHE_TTL_DAYS } from '../constants/readerEngine.constants';

const CACHE_PREFIX = 'authoros_offline_';

export class OfflineCacheManager {
  private syncQueue: OfflineSyncQueueItem[] = [];

  constructor(private readonly downloadRepo: EngineDownloadRepository) {}

  async queueDownload(input: DownloadBookInput): Promise<OfflineCacheEntry> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + OFFLINE_CACHE_TTL_DAYS);

    const row = await this.downloadRepo.upsertDownload({
      user_id: input.userId,
      book_id: input.bookId,
      format: input.format,
      status: 'queued',
      wifi_only: input.wifiOnly ?? true,
      device_id: input.deviceId ?? null,
    });

    return this.mapDownloadRow(row);
  }

  async markReady(userId: string, bookId: string, format: DigitalFormat, storagePath: string): Promise<OfflineCacheEntry> {
    const row = await this.downloadRepo.upsertDownload({
      user_id: userId,
      book_id: bookId,
      format,
      status: 'completed',
      storage_path: storagePath,
      completed_at: new Date().toISOString(),
    });
    this.setLocalCache(bookId, format, storagePath);
    return this.mapDownloadRow(row);
  }

  getLocalCache(bookId: string, format: DigitalFormat): string | null {
    return localStorage.getItem(`${CACHE_PREFIX}${bookId}_${format}`);
  }

  setLocalCache(bookId: string, format: DigitalFormat, path: string): void {
    localStorage.setItem(`${CACHE_PREFIX}${bookId}_${format}`, path);
  }

  enqueueSyncItem(entityType: string, payload: Record<string, unknown>): void {
    this.syncQueue.push({
      id: `sync_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      entityType,
      payload,
      queuedAt: new Date().toISOString(),
      retryCount: 0,
    });
  }

  getPendingSyncItems(): OfflineSyncQueueItem[] {
    return [...this.syncQueue];
  }

  clearSyncItem(id: string): void {
    this.syncQueue = this.syncQueue.filter((item) => item.id !== id);
  }

  private mapDownloadRow(row: {
    book_id: string;
    format: DigitalFormat;
    status: string;
    storage_path: string | null;
    completed_at: string | null;
    expires_at: string | null;
    file_size_bytes: number | null;
  }): OfflineCacheEntry {
    return {
      bookId: row.book_id,
      format: row.format,
      status: row.status as OfflineCacheEntry['status'],
      storagePath: row.storage_path,
      cachedAt: row.completed_at,
      expiresAt: row.expires_at,
      fileSizeBytes: row.file_size_bytes,
    };
  }
}

export function createOfflineCacheManager(repo: EngineDownloadRepository): OfflineCacheManager {
  return new OfflineCacheManager(repo);
}
