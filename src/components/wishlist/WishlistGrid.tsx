import { memo, useEffect } from 'react';
import type { MockWishlistBook } from '../../data/mockWishlistBooks';
import type { WishlistViewMode } from '../../lib/wishlistBookLogic';
import { WishlistBookItem } from './WishlistBookItem';
import { WishlistStatePanel } from './WishlistStatePanel';

interface WishlistGridProps {
  books: MockWishlistBook[];
  viewMode: WishlistViewMode;
  datasetEmpty: boolean;
  selectedBookId: string | null;
  onSelectBook: (bookId: string) => void;
  onClearSelection: () => void;
}

export const WishlistGrid = memo(function WishlistGrid({
  books,
  viewMode,
  datasetEmpty,
  selectedBookId,
  onSelectBook,
  onClearSelection,
}: WishlistGridProps) {
  useEffect(() => {
    if (selectedBookId && !books.some((book) => book.id === selectedBookId)) {
      onClearSelection();
    }
  }, [books, selectedBookId, onClearSelection]);

  if (datasetEmpty) {
    return <WishlistStatePanel variant="empty" />;
  }

  if (books.length === 0) {
    return <WishlistStatePanel variant="no-results" />;
  }

  const listClassName =
    viewMode === 'list'
      ? 'flex flex-col gap-4 sm:gap-5'
      : 'grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div role="list" aria-label="Wishlist books" className={listClassName}>
      {books.map((book) => (
        <div key={book.id} role="listitem" className="h-full min-h-0">
          <WishlistBookItem
            book={book}
            selected={selectedBookId === book.id}
            onSelect={onSelectBook}
            compact={viewMode === 'list'}
          />
        </div>
      ))}
    </div>
  );
});

export default WishlistGrid;
