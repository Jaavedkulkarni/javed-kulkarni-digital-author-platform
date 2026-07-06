import type { BookFormat } from '../components/book/bookTypes';

export type MockReadingStatus = 'not-started' | 'reading' | 'completed' | 'paused';

export interface MockReadingRecord {
  id: string;
  bookId: string;
  title: string;
  author: string;
  cover: string | null;
  language: string;
  category: string;
  format: BookFormat;
  status: MockReadingStatus;
  currentPage: number;
  totalPages: number;
  progressPercent: number;
  startedAt: string | null;
  lastReadAt: string | null;
  completedAt: string | null;
  readingTimeMinutes: number;
  averageSessionMinutes: number;
  estimatedRemainingMinutes: number;
  bookmarks: number;
  highlights: number;
  notes: number;
  favorite: boolean;
  membershipBook: boolean;
  offlineAvailable: boolean;
}

/** Synced at runtime by reader data layer. */
export const MOCK_READING_PROGRESS: MockReadingRecord[] = [];
