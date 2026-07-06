import { withRetry } from '../../lib/utils/retry';
import { getReaderDataAccess } from '../infrastructure/readerDataAccess';
import { loadBookCatalog } from '../infrastructure/bookCatalog';
import { mapWishlistItemToMockBook } from '../mappers/wishlist.mapper';
import type { MockWishlistBook } from '../../data/mockWishlistBooks';

export async function fetchWishlistBooks(userId: string): Promise<MockWishlistBook[]> {
  const { repositories } = getReaderDataAccess();

  const wishlistItems = await withRetry(
    async () => repositories.wishlist.findByUser(userId),
    { scope: 'reader.wishlist.fetch' }
  );

  const catalog = await loadBookCatalog(wishlistItems.map((item) => item.book_id));
  return wishlistItems.map((item) => mapWishlistItemToMockBook(item, catalog));
}

export async function addBookToWishlist(userId: string, bookId: string) {
  const { repositories } = getReaderDataAccess();
  const existing = await repositories.wishlist.findByUserAndBook(userId, bookId);
  if (existing) return existing;
  return repositories.wishlist.addToWishlist({ user_id: userId, book_id: bookId });
}

export async function removeBookFromWishlist(wishlistItemId: string) {
  const { repositories } = getReaderDataAccess();
  await repositories.wishlist.delete(wishlistItemId);
}
