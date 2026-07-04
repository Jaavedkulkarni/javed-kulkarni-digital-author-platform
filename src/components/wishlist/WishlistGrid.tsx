import { WishlistBookCard } from './WishlistBookCard';
import { WishlistEmptyState } from './WishlistEmptyState';
import type { WishlistBookItem } from './wishlistTypes';

interface WishlistGridProps {
  books?: WishlistBookItem[];
}

export function WishlistGrid({ books = [] }: WishlistGridProps) {
  if (books.length === 0) {
    return <WishlistEmptyState />;
  }

  return (
    <div
      role="list"
      aria-label="Wishlist books"
      className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {books.map((book) => (
        <div key={book.id} role="listitem">
          <WishlistBookCard book={book} />
        </div>
      ))}
    </div>
  );
}

export default WishlistGrid;
