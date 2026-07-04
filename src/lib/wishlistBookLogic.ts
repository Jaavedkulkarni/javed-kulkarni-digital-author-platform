import type { WishlistBookItem, WishlistAvailability } from '../components/wishlist/wishlistTypes';
import type { MockWishlistBook } from '../data/mockWishlistBooks';

export type WishlistSortKey =
  | 'recently-added'
  | 'price-low'
  | 'price-high'
  | 'highest-discount'
  | 'a-z';

export type WishlistViewMode = 'grid' | 'list';

export type WishlistTriFilter = 'all' | 'yes' | 'no';

export type WishlistAvailabilityFilter = 'all' | WishlistAvailability;

export interface WishlistFilters {
  language: string;
  category: string;
  availability: WishlistAvailabilityFilter;
  membership: WishlistTriFilter;
  discount: WishlistTriFilter;
}

export const DEFAULT_WISHLIST_FILTERS: WishlistFilters = {
  language: 'all',
  category: 'all',
  availability: 'all',
  membership: 'all',
  discount: 'all',
};

export interface WishlistStats {
  total: number;
  discounted: number;
  membershipAvailable: number;
  priceDropAlerts: number;
}

export function formatWishlistPrice(amount: number): string {
  if (amount === 0) return 'Free';
  return `₹${amount.toLocaleString('en-IN')}`;
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

export function toWishlistBookItem(book: MockWishlistBook): WishlistBookItem {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    language: book.language,
    category: book.category,
    format: book.format,
    coverUrl: book.cover,
    coverAlt: `${book.title} cover`,
    price: formatWishlistPrice(book.price),
    originalPrice: book.originalPrice ? formatWishlistPrice(book.originalPrice) : undefined,
    discountPercent: book.discount > 0 ? book.discount : undefined,
    availability: book.availability,
    addedDate: formatDisplayDate(book.addedDate),
    status: book.membership ? 'membership' : undefined,
  };
}

export function searchWishlistBooks(books: MockWishlistBook[], query: string): MockWishlistBook[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return books;

  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(normalized) ||
      book.author.toLowerCase().includes(normalized) ||
      book.category.toLowerCase().includes(normalized)
  );
}

export function filterWishlistBooks(
  books: MockWishlistBook[],
  filters: WishlistFilters
): MockWishlistBook[] {
  return books.filter((book) => {
    if (filters.language !== 'all' && book.language !== filters.language) return false;
    if (filters.category !== 'all' && book.category !== filters.category) return false;
    if (filters.availability !== 'all' && book.availability !== filters.availability) return false;

    if (filters.membership === 'yes' && !book.membership) return false;
    if (filters.membership === 'no' && book.membership) return false;

    if (filters.discount === 'yes' && book.discount <= 0) return false;
    if (filters.discount === 'no' && book.discount > 0) return false;

    return true;
  });
}

export function sortWishlistBooks(
  books: MockWishlistBook[],
  sortKey: WishlistSortKey
): MockWishlistBook[] {
  const sorted = [...books];

  switch (sortKey) {
    case 'recently-added':
      return sorted.sort(
        (a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
      );
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'highest-discount':
      return sorted.sort((a, b) => b.discount - a.discount);
    case 'a-z':
      return sorted.sort((a, b) => a.title.localeCompare(b.title, 'mr'));
    default:
      return sorted;
  }
}

export function calculateWishlistStats(books: MockWishlistBook[]): WishlistStats {
  return books.reduce<WishlistStats>(
    (stats, book) => {
      stats.total += 1;
      if (book.discount > 0) stats.discounted += 1;
      if (book.membership || book.availability === 'membership') stats.membershipAvailable += 1;
      if (book.originalPrice !== null && book.originalPrice > book.price) stats.priceDropAlerts += 1;
      return stats;
    },
    { total: 0, discounted: 0, membershipAvailable: 0, priceDropAlerts: 0 }
  );
}

export function hasActiveWishlistFilters(filters: WishlistFilters, searchQuery: string): boolean {
  return (
    searchQuery.trim().length > 0 ||
    filters.language !== 'all' ||
    filters.category !== 'all' ||
    filters.availability !== 'all' ||
    filters.membership !== 'all' ||
    filters.discount !== 'all'
  );
}

export function getWishlistFilterOptions(books: MockWishlistBook[]) {
  const languages = [...new Set(books.map((book) => book.language))].sort();
  const categories = [...new Set(books.map((book) => book.category))].sort();
  return { languages, categories };
}

export function processWishlistBooks(
  books: MockWishlistBook[],
  query: string,
  filters: WishlistFilters,
  sortKey: WishlistSortKey
): MockWishlistBook[] {
  const filtered = filterWishlistBooks(books, filters);
  const searched = searchWishlistBooks(filtered, query);
  return sortWishlistBooks(searched, sortKey);
}
