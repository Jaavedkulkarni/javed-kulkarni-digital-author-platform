import type { LibraryItem, ReadingProgress, Tables } from '../../types/database';
import type { MockLibraryBook } from '../../data/mockLibraryBooks';
import type { BookCatalogContext } from '../infrastructure/bookCatalog';
import {
  formatDateLabel,
  isMembershipSource,
  mapDigitalFormatToBookFormat,
  resolveBookAuthor,
  resolveBookCategory,
  resolveBookCover,
  resolveBookLanguage,
  resolveBookTitle,
  resolveProgressPercent,
} from './format';

export function mapLibraryItemToMockBook(
  item: LibraryItem,
  catalog: BookCatalogContext,
  progress?: ReadingProgress,
  download?: Tables<'downloads'>
): MockLibraryBook {
  const book = catalog.books.get(item.book_id);
  const progressPercent = resolveProgressPercent(item, progress);

  return {
    id: item.id,
    title: resolveBookTitle(book),
    author: resolveBookAuthor(book),
    cover: resolveBookCover(book),
    language: resolveBookLanguage(book),
    category: resolveBookCategory(book, catalog.categories),
    format: mapDigitalFormatToBookFormat(item.format),
    purchaseDate: formatDateLabel(item.acquired_at),
    progress: progressPercent,
    downloaded: download?.status === 'completed' || download?.status === 'ready',
    completed: progress?.is_completed ?? progressPercent >= 100,
    membership: isMembershipSource(item.source),
    lastOpened: formatDateLabel(item.last_opened_at) || null,
  };
}
