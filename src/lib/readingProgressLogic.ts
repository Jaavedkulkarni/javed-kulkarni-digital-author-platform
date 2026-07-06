import type { ReadingCardItem, ReadingStatus } from '../components/reading/readingTypes';
import type { ReadingSortKey } from '../components/reading/readingTypes';
import type { MockReadingRecord } from '../data/mockReadingProgress';

export type { ReadingSortKey };

export type ReadingViewMode = 'grid' | 'list';

export type ReadingTriFilter = 'all' | 'yes' | 'no';

export type ReadingStatusFilter = 'all' | ReadingStatus;

export interface ReadingFilters {
  status: ReadingStatusFilter;
  language: string;
  category: string;
  membershipBooks: ReadingTriFilter;
  favorites: ReadingTriFilter;
  offlineAvailable: ReadingTriFilter;
}

export const DEFAULT_READING_FILTERS: ReadingFilters = {
  status: 'all',
  language: 'all',
  category: 'all',
  membershipBooks: 'all',
  favorites: 'all',
  offlineAvailable: 'all',
};

export interface ReadingStats {
  booksStarted: number;
  booksCompleted: number;
  currentlyReading: number;
  averageProgress: number;
  readingStreak: number;
  readingTimeMinutes: number;
}

export function formatDisplayDate(isoDate: string | null): string {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatReadingDuration(minutes: number): string {
  if (minutes <= 0) return '—';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

export function toReadingCardItem(record: MockReadingRecord): ReadingCardItem {
  return {
    id: record.id,
    title: record.title,
    author: record.author,
    coverUrl: record.cover,
    coverAlt: `${record.title} cover`,
    language: record.language,
    category: record.category,
    format: record.format,
    progressPercent: record.progressPercent,
    currentPage: record.currentPage,
    totalPages: record.totalPages,
    timeSpent: formatReadingDuration(record.readingTimeMinutes),
    lastRead: formatDisplayDate(record.lastReadAt),
    estimatedTimeRemaining: formatReadingDuration(record.estimatedRemainingMinutes),
    readingStatus: record.status,
    startedReading: formatDisplayDate(record.startedAt),
    lastOpened: formatDisplayDate(record.lastReadAt),
    currentProgressLabel: `${record.progressPercent}%`,
    completedDate: formatDisplayDate(record.completedAt),
  };
}

export function searchReadingRecords(records: MockReadingRecord[], query: string): MockReadingRecord[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return records;

  return records.filter(
    (record) =>
      record.title.toLowerCase().includes(normalized) ||
      record.author.toLowerCase().includes(normalized) ||
      record.category.toLowerCase().includes(normalized)
  );
}

export function filterReadingRecords(
  records: MockReadingRecord[],
  filters: ReadingFilters
): MockReadingRecord[] {
  return records.filter((record) => {
    if (filters.status !== 'all' && record.status !== filters.status) return false;
    if (filters.language !== 'all' && record.language !== filters.language) return false;
    if (filters.category !== 'all' && record.category !== filters.category) return false;

    if (filters.membershipBooks === 'yes' && !record.membershipBook) return false;
    if (filters.membershipBooks === 'no' && record.membershipBook) return false;

    if (filters.favorites === 'yes' && !record.favorite) return false;
    if (filters.favorites === 'no' && record.favorite) return false;

    if (filters.offlineAvailable === 'yes' && !record.offlineAvailable) return false;
    if (filters.offlineAvailable === 'no' && record.offlineAvailable) return false;

    return true;
  });
}

function dateValue(isoDate: string | null): number {
  if (!isoDate) return 0;
  const time = new Date(isoDate).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function sortReadingRecords(
  records: MockReadingRecord[],
  sortKey: ReadingSortKey
): MockReadingRecord[] {
  const sorted = [...records];

  switch (sortKey) {
    case 'recently-read':
      return sorted.sort((a, b) => dateValue(b.lastReadAt) - dateValue(a.lastReadAt));
    case 'recently-started':
      return sorted.sort((a, b) => dateValue(b.startedAt) - dateValue(a.startedAt));
    case 'progress-high':
      return sorted.sort((a, b) => b.progressPercent - a.progressPercent);
    case 'progress-low':
      return sorted.sort((a, b) => a.progressPercent - b.progressPercent);
    case 'a-z':
      return sorted.sort((a, b) => a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }));
    case 'time-spent':
      return sorted.sort((a, b) => b.readingTimeMinutes - a.readingTimeMinutes);
    default:
      return sorted;
  }
}

function toDateKey(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function calculateReadingStreak(records: MockReadingRecord[]): number {
  const readDays = new Set<string>();
  for (const record of records) {
    if (record.lastReadAt) {
      const key = toDateKey(record.lastReadAt);
      if (key) readDays.add(key);
    }
  }

  if (readDays.size === 0) return 0;

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!readDays.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function calculateReadingStats(records: MockReadingRecord[]): ReadingStats {
  let booksStarted = 0;
  let booksCompleted = 0;
  let currentlyReading = 0;
  let progressSum = 0;
  let readingTimeMinutes = 0;

  for (const record of records) {
    if (record.startedAt || record.progressPercent > 0) booksStarted += 1;
    if (record.status === 'completed') booksCompleted += 1;
    if (record.status === 'reading') currentlyReading += 1;
    progressSum += record.progressPercent;
    readingTimeMinutes += record.readingTimeMinutes;
  }

  const averageProgress = records.length > 0 ? Math.round(progressSum / records.length) : 0;

  return {
    booksStarted,
    booksCompleted,
    currentlyReading,
    averageProgress,
    readingStreak: calculateReadingStreak(records),
    readingTimeMinutes,
  };
}

export function hasActiveReadingFilters(filters: ReadingFilters, searchQuery: string): boolean {
  return (
    searchQuery.trim().length > 0 ||
    filters.status !== 'all' ||
    filters.language !== 'all' ||
    filters.category !== 'all' ||
    filters.membershipBooks !== 'all' ||
    filters.favorites !== 'all' ||
    filters.offlineAvailable !== 'all'
  );
}

export function getReadingFilterOptions(records: MockReadingRecord[]) {
  const languages = [...new Set(records.map((record) => record.language))].sort((a, b) =>
    a.localeCompare(b, 'en', { sensitivity: 'base' })
  );
  const categories = [...new Set(records.map((record) => record.category))].sort((a, b) =>
    a.localeCompare(b, 'en', { sensitivity: 'base' })
  );
  return { languages, categories };
}

export function processReadingRecords(
  records: MockReadingRecord[],
  query: string,
  filters: ReadingFilters,
  sortKey: ReadingSortKey
): MockReadingRecord[] {
  const filtered = filterReadingRecords(records, filters);
  const searched = searchReadingRecords(filtered, query);
  return sortReadingRecords(searched, sortKey);
}

export function findMockReadingRecord(
  records: MockReadingRecord[],
  recordId: string
): MockReadingRecord | undefined {
  return records.find((record) => record.id === recordId);
}
