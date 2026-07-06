import { withRetry } from '../../lib/utils/retry';
import { getReaderDataAccess } from '../infrastructure/readerDataAccess';
import { loadBookCatalog } from '../infrastructure/bookCatalog';
import { mapLibraryItemToMockBook } from '../mappers/library.mapper';
import type { MockLibraryBook } from '../../data/mockLibraryBooks';

export async function fetchLibraryBooks(userId: string): Promise<MockLibraryBook[]> {
  const { repositories, readerRepositories } = getReaderDataAccess();

  const [libraryItems, progressRows, downloadRows] = await withRetry(
    async () =>
      Promise.all([
        repositories.library.findByUser(userId),
        repositories.readingProgress.findByUser(userId),
        readerRepositories.downloads.findByUser(userId),
      ]),
    { scope: 'reader.library.fetch' }
  );

  const catalog = await loadBookCatalog(libraryItems.map((item) => item.book_id));
  const progressByBook = new Map(progressRows.map((row) => [row.book_id, row]));
  const downloadsByBook = new Map(downloadRows.map((row) => [row.book_id, row]));

  return libraryItems.map((item) =>
    mapLibraryItemToMockBook(
      item,
      catalog,
      progressByBook.get(item.book_id),
      downloadsByBook.get(item.book_id)
    )
  );
}

export async function addBookToLibrary(userId: string, bookId: string, source = 'purchase') {
  const { repositories } = getReaderDataAccess();
  const existing = await repositories.library.findByUserAndBook(userId, bookId);
  if (existing) return existing;
  return repositories.library.addToLibrary({
    user_id: userId,
    book_id: bookId,
    source,
    format: 'epub',
  });
}
