import type { BookFormat } from '../components/book/bookTypes';
import type { WishlistAvailability } from '../components/wishlist/wishlistTypes';

export interface MockWishlistBook {
  id: string;
  title: string;
  author: string;
  cover: string | null;
  language: string;
  category: string;
  format: BookFormat;
  price: number;
  originalPrice: number | null;
  discount: number;
  membership: boolean;
  availability: WishlistAvailability;
  addedDate: string;
}

/** Synced at runtime by reader data layer. */
export const MOCK_WISHLIST_BOOKS: MockWishlistBook[] = [];
