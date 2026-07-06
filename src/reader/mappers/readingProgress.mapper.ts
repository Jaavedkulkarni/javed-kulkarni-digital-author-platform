import type { ReadingProgress, Tables } from '../../types/database';
import type { MockReadingRecord, MockReadingStatus } from '../../data/mockReadingProgress';
import type { BookCatalogContext } from '../infrastructure/bookCatalog';
import {
  formatDateLabel,
  mapDigitalFormatToBookFormat,
  resolveBookAuthor,
  resolveBookCategory,
  resolveBookCover,
  resolveBookLanguage,
  resolveBookTitle,
} from './format';

function resolveStatus(progress: ReadingProgress): MockReadingStatus {
  if (progress.is_completed) return 'completed';
  if (progress.progress_percent > 0) return 'reading';
  return 'not-started';
}

export function mapReadingProgressToMockRecord(
  progress: ReadingProgress,
  catalog: BookCatalogContext,
  counts: { bookmarks: number; highlights: number; notes: number },
  download?: Tables<'downloads'>
): MockReadingRecord {
  const book = catalog.books.get(progress.book_id);
  const readingTimeMinutes = Math.max(1, Math.round(progress.reading_time_seconds / 60));
  const totalPages = progress.total_pages ?? book?.page_count ?? book?.total_pages ?? 0;
  const currentPage = progress.current_page ?? Math.round((progress.progress_percent / 100) * totalPages);

  return {
    id: progress.id,
    bookId: progress.book_id,
    title: resolveBookTitle(book),
    author: resolveBookAuthor(book),
    cover: resolveBookCover(book),
    language: resolveBookLanguage(book),
    category: resolveBookCategory(book, catalog.categories),
    format: mapDigitalFormatToBookFormat(progress.format),
    status: resolveStatus(progress),
    currentPage,
    totalPages,
    progressPercent: Math.round(progress.progress_percent),
    startedAt: formatDateLabel(progress.created_at) || null,
    lastReadAt: formatDateLabel(progress.last_read_at) || null,
    completedAt: formatDateLabel(progress.completed_at) || null,
    readingTimeMinutes,
    averageSessionMinutes: Math.max(1, Math.round(readingTimeMinutes / 3)),
    estimatedRemainingMinutes: Math.max(
      0,
      Math.round((readingTimeMinutes * (100 - progress.progress_percent)) / Math.max(progress.progress_percent, 1))
    ),
    bookmarks: counts.bookmarks,
    highlights: counts.highlights,
    notes: counts.notes,
    favorite: false,
    membershipBook: book?.members_only ?? false,
    offlineAvailable: download?.status === 'completed' || download?.status === 'ready',
  };
}
