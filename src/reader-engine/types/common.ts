import type { DigitalFormat } from '../../types/database';

export type ReaderFormat = DigitalFormat | 'audio';

export type ReaderThemeId = 'light' | 'dark' | 'sepia';

export type ReaderLayoutMode = 'paginated' | 'scroll' | 'continuous';

export interface ReaderLocation {
  chapterId?: string | null;
  chapterNumber?: number | null;
  pageNumber?: number | null;
  positionPercent?: number | null;
  cfi?: string | null;
  cfiRange?: string | null;
}

export interface DeviceInfo {
  deviceId: string;
  platform: string;
  appVersion: string;
  lastSyncedAt?: string | null;
}

export interface ReaderOperationResult<T = void> {
  success: boolean;
  data?: T;
  errors?: string[];
}
