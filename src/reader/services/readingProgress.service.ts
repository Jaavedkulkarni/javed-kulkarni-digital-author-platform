import { withRetry } from '../../lib/utils/retry';
import { getReaderDataAccess } from '../infrastructure/readerDataAccess';
import { loadBookCatalog } from '../infrastructure/bookCatalog';
import { mapReadingProgressToMockRecord } from '../mappers/readingProgress.mapper';
import type { MockReadingRecord } from '../../data/mockReadingProgress';

export async function fetchReadingProgress(userId: string): Promise<MockReadingRecord[]> {
  const { repositories, readerRepositories } = getReaderDataAccess();

  const [progressRows, downloadRows] = await withRetry(
    async () =>
      Promise.all([
        repositories.readingProgress.findByUser(userId),
        readerRepositories.downloads.findByUser(userId),
      ]),
    { scope: 'reader.progress.fetch' }
  );

  const catalog = await loadBookCatalog(progressRows.map((row) => row.book_id));
  const downloadsByBook = new Map(downloadRows.map((row) => [row.book_id, row]));

  const records: MockReadingRecord[] = [];

  for (const progress of progressRows) {
    const [bookmarks, highlights, notes] = await Promise.all([
      readerRepositories.bookmarks.countByUserAndBook(userId, progress.book_id),
      readerRepositories.highlights.countByUserAndBook(userId, progress.book_id),
      readerRepositories.notes.countByUserAndBook(userId, progress.book_id),
    ]);

    records.push(
      mapReadingProgressToMockRecord(
        progress,
        catalog,
        { bookmarks, highlights, notes },
        downloadsByBook.get(progress.book_id)
      )
    );
  }

  return records;
}

export async function upsertReadingProgress(
  userId: string,
  bookId: string,
  payload: { progressPercent: number; currentPage?: number; isCompleted?: boolean }
) {
  const { repositories } = getReaderDataAccess();
  return repositories.readingProgress.upsertProgress({
    user_id: userId,
    book_id: bookId,
    progress_percent: payload.progressPercent,
    current_page: payload.currentPage ?? null,
    is_completed: payload.isCompleted ?? payload.progressPercent >= 100,
    last_read_at: new Date().toISOString(),
    format: 'epub',
  });
}
