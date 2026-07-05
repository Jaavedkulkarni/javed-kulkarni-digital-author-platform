import type { BookFormat } from '../book/bookTypes';

export type DownloadStatus = 'ready' | 'downloading' | 'failed' | 'expired';

export type DownloadViewMode = 'grid' | 'list';

export interface DownloadCardItem {
  id: string;
  title?: string;
  author?: string;
  coverUrl?: string | null;
  coverAlt?: string;
  language?: string;
  category?: string;
  format?: BookFormat;
  downloadedDate?: string;
  fileSize?: string;
  downloadStatus?: DownloadStatus;
  offlineAvailable?: boolean;
}

export const DOWNLOAD_STATUS_LABELS: Record<DownloadStatus, string> = {
  ready: 'Ready',
  downloading: 'Downloading',
  failed: 'Failed',
  expired: 'Expired',
};

export const DOWNLOAD_STATUS_STYLES: Record<DownloadStatus, string> = {
  ready: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300',
  downloading: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300',
  failed: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-300',
  expired: 'border-gray-200 bg-gray-100 text-gray-600 dark:border-navy-600 dark:bg-navy-700 dark:text-gray-400',
};

export const OFFLINE_BADGE_STYLE =
  'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/15 dark:text-sky-300';
