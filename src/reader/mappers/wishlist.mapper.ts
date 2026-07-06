import type { WishlistItem } from '../../types/database';
import type { MockWishlistBook } from '../../data/mockWishlistBooks';
import type { WishlistAvailability } from '../../components/wishlist/wishlistTypes';
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

function resolveAvailability(book: ReturnType<BookCatalogContext['books']['get']>): WishlistAvailability {
  if (!book) return 'out-of-stock';
  if (book.members_only) return 'membership';
  if (book.workflow_status === 'published') return 'in-stock';
  return 'out-of-stock';
}

export function mapWishlistItemToMockBook(
  item: WishlistItem,
  catalog: BookCatalogContext
): MockWishlistBook {
  const book = catalog.books.get(item.book_id);
  const salePrice = book?.sale_price ?? book?.regular_price ?? 0;
  const regularPrice = book?.regular_price ?? salePrice;
  const discount =
    regularPrice > 0 && salePrice < regularPrice
      ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
      : 0;

  return {
    id: item.id,
    title: resolveBookTitle(book),
    author: resolveBookAuthor(book),
    cover: resolveBookCover(book),
    language: resolveBookLanguage(book),
    category: resolveBookCategory(book, catalog.categories),
    format: mapDigitalFormatToBookFormat(book?.epub_storage_path ? 'epub' : 'pdf'),
    price: salePrice,
    originalPrice: discount > 0 ? regularPrice : null,
    discount,
    membership: book?.members_only ?? false,
    availability: resolveAvailability(book),
    addedDate: formatDateLabel(item.added_at),
  };
}
