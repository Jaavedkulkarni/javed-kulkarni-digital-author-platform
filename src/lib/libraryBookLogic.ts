import type { BookCardData, BookStatus } from '../components/book/bookTypes';
import type { MockLibraryBook } from '../data/mockLibraryBooks';

export type LibrarySortKey =
  | 'recently-added'
  | 'recently-opened'
  | 'a-z'
  | 'reading-progress'
  | 'purchase-date';

export type LibraryViewMode = 'grid' | 'list';

export type LibraryStatusFilter = 'all' | 'completed' | 'in-progress' | 'unread';

export type LibraryTriFilter = 'all' | 'yes' | 'no';

export interface LibraryFilters {
  language: string;
  category: string;
  status: LibraryStatusFilter;
  downloaded: LibraryTriFilter;
  membership: LibraryTriFilter;
}

export const DEFAULT_LIBRARY_FILTERS: LibraryFilters = {
  language: 'all',
  category: 'all',
  status: 'all',
  downloaded: 'all',
  membership: 'all',
};

export interface LibraryStats {
  total: number;
  completed: number;
  inProgress: number;
  unread: number;
  downloaded: number;
}

export function formatDisplayDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function toBookCardData(book: MockLibraryBook): BookCardData {
  let status: BookStatus = 'purchased';
  if (book.membership) status = 'membership';
  else if (!book.downloaded && book.progress === 0) status = 'free';

  return {
    id: book.id,
    title: book.title,
    author: book.author,
    language: book.language,
    category: book.category,
    format: book.format,
    publicationDate: formatDisplayDate(book.purchaseDate),
    progress: book.progress,
    status,
    coverUrl: book.cover,
    coverAlt: `${book.title} cover`,
  };
}

export function searchLibraryBooks(books: MockLibraryBook[], query: string): MockLibraryBook[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return books;

  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(normalized) ||
      book.author.toLowerCase().includes(normalized) ||
      book.category.toLowerCase().includes(normalized)
  );
}

export function filterLibraryBooks(books: MockLibraryBook[], filters: LibraryFilters): MockLibraryBook[] {
  return books.filter((book) => {
    if (filters.language !== 'all' && book.language !== filters.language) return false;
    if (filters.category !== 'all' && book.category !== filters.category) return false;

    if (filters.status === 'completed' && !book.completed) return false;
    if (filters.status === 'in-progress' && (book.completed || book.progress === 0)) return false;
    if (filters.status === 'unread' && book.progress > 0) return false;

    if (filters.downloaded === 'yes' && !book.downloaded) return false;
    if (filters.downloaded === 'no' && book.downloaded) return false;

    if (filters.membership === 'yes' && !book.membership) return false;
    if (filters.membership === 'no' && book.membership) return false;

    return true;
  });
}

export function sortLibraryBooks(books: MockLibraryBook[], sortKey: LibrarySortKey): MockLibraryBook[] {
  const sorted = [...books];

  switch (sortKey) {
    case 'recently-added':
      return sorted.sort(
        (a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
      );
    case 'recently-opened':
      return sorted.sort((a, b) => {
        const aTime = a.lastOpened ? new Date(a.lastOpened).getTime() : 0;
        const bTime = b.lastOpened ? new Date(b.lastOpened).getTime() : 0;
        return bTime - aTime;
      });
    case 'a-z':
      return sorted.sort((a, b) => a.title.localeCompare(b.title, 'mr'));
    case 'reading-progress':
      return sorted.sort((a, b) => b.progress - a.progress);
    case 'purchase-date':
      return sorted.sort(
        (a, b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()
      );
    default:
      return sorted;
  }
}

export function calculateLibraryStats(books: MockLibraryBook[]): LibraryStats {
  return books.reduce<LibraryStats>(
    (stats, book) => {
      stats.total += 1;
      if (book.completed) stats.completed += 1;
      if (!book.completed && book.progress > 0) stats.inProgress += 1;
      if (book.progress === 0) stats.unread += 1;
      if (book.downloaded) stats.downloaded += 1;
      return stats;
    },
    { total: 0, completed: 0, inProgress: 0, unread: 0, downloaded: 0 }
  );
}

export function hasActiveLibraryFilters(filters: LibraryFilters, searchQuery: string): boolean {
  return (
    searchQuery.trim().length > 0 ||
    filters.language !== 'all' ||
    filters.category !== 'all' ||
    filters.status !== 'all' ||
    filters.downloaded !== 'all' ||
    filters.membership !== 'all'
  );
}

export function getLibraryFilterOptions(books: MockLibraryBook[]) {
  const languages = [...new Set(books.map((book) => book.language))].sort();
  const categories = [...new Set(books.map((book) => book.category))].sort();
  return { languages, categories };
}

export function processLibraryBooks(
  books: MockLibraryBook[],
  query: string,
  filters: LibraryFilters,
  sortKey: LibrarySortKey
): MockLibraryBook[] {
  const filtered = filterLibraryBooks(books, filters);
  const searched = searchLibraryBooks(filtered, query);
  return sortLibraryBooks(searched, sortKey);
}
