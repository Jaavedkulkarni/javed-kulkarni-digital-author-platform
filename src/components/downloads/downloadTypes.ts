import type { BookFormat } from '../book/bookTypes';

export type DownloadStatus = 'downloaded' | 'expired' | 'pending' | 'membership';

export type DownloadViewMode = 'grid' | 'list';

export type DownloadSortKey = 'newest' | 'oldest' | 'recently-downloaded' | 'a-z';

export interface DownloadCardItem {
  id: string;
  title?: string;
  author?: string;
  coverUrl?: string | null;
  coverAlt?: string;
  language?: string;
  category?: string;
  format?: BookFormat;
  downloadedOn?: string;
  lastOpened?: string;
  downloadSize?: string;
  downloadStatus?: DownloadStatus;
  offlineAvailable?: boolean;
  deviceCount?: string;
}

export const DOWNLOAD_STATUS_LABELS: Record<DownloadStatus, string> = {
  downloaded: 'Downloaded',
  expired: 'Expired',
  pending: 'Pending',
  membership: 'Membership',
};

export const DOWNLOAD_STATUS_STYLES: Record<DownloadStatus, string> = {
  downloaded:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300',
  expired:
    'border-gray-200 bg-gray-100 text-gray-600 dark:border-navy-600 dark:bg-navy-700 dark:text-gray-400',
  pending:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300',
  membership:
    'border-gold-300 bg-gold-50 text-gold-800 dark:border-gold-700 dark:bg-gold-950/40 dark:text-gold-300',
};

export const OFFLINE_BADGE_STYLE =
  'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/15 dark:text-sky-300';

export const DOWNLOAD_SORT_OPTIONS: { value: DownloadSortKey; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'recently-downloaded', label: 'Recently Downloaded' },
  { value: 'a-z', label: 'A–Z' },
];

export const DOWNLOAD_STATS_PLACEHOLDER = [
  { label: 'Total Downloads', value: '0' },
  { label: 'Available Offline', value: '0' },
  { label: 'Expired Downloads', value: '0' },
  { label: 'Downloaded Today', value: '0' },
] as const;
