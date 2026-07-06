import type { BookFormat } from '../book/bookTypes';

export type ReadingStatus = 'not-started' | 'reading' | 'completed' | 'paused';

export type ReadingViewMode = 'grid' | 'list';

export type ReadingSortKey =
  | 'recently-read'
  | 'recently-started'
  | 'progress-high'
  | 'progress-low'
  | 'a-z'
  | 'time-spent';

export interface ReadingCardItem {
  id: string;
  title?: string;
  author?: string;
  coverUrl?: string | null;
  coverAlt?: string;
  language?: string;
  category?: string;
  format?: BookFormat;
  progressPercent?: number;
  currentPage?: number;
  totalPages?: number;
  timeSpent?: string;
  lastRead?: string;
  estimatedTimeRemaining?: string;
  readingStatus?: ReadingStatus;
  startedReading?: string;
  lastOpened?: string;
  currentProgressLabel?: string;
  completedDate?: string;
}

export const READING_STATUS_LABELS: Record<ReadingStatus, string> = {
  'not-started': 'Not Started',
  reading: 'Reading',
  completed: 'Completed',
  paused: 'Paused',
};

export const READING_STATUS_STYLES: Record<ReadingStatus, string> = {
  'not-started':
    'border-gray-200 bg-gray-100 text-gray-600 dark:border-navy-600 dark:bg-navy-700 dark:text-gray-400',
  reading:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300',
  completed:
    'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/15 dark:text-sky-300',
  paused:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300',
};

export const READING_SORT_OPTIONS: { value: ReadingSortKey; label: string }[] = [
  { value: 'recently-read', label: 'Recently Read' },
  { value: 'recently-started', label: 'Recently Started' },
  { value: 'progress-high', label: 'Highest Progress' },
  { value: 'progress-low', label: 'Lowest Progress' },
  { value: 'a-z', label: 'A–Z' },
  { value: 'time-spent', label: 'Reading Time' },
];

export const READING_STATS_PLACEHOLDER = [
  { label: 'Books Started', value: '0' },
  { label: 'Books Completed', value: '0' },
  { label: 'Currently Reading', value: '0' },
  { label: 'Average Progress', value: '—' },
  { label: 'Reading Streak', value: '0' },
  { label: 'Reading Time', value: '—' },
] as const;

export const READING_TIMELINE_STEPS = [
  { key: 'started', label: 'Started Reading' },
  { key: 'lastOpened', label: 'Last Opened' },
  { key: 'currentProgress', label: 'Current Progress' },
  { key: 'completed', label: 'Completed' },
] as const;
