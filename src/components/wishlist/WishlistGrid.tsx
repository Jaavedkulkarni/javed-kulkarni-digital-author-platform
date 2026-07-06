import { memo, useEffect } from 'react';
import type { MockWishlistBook } from '../../data/mockWishlistBooks';
import type { WishlistViewMode } from '../../lib/wishlistBookLogic';
import { ResponsiveGrid } from '../shared/layout/ResponsiveGrid';
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

  return (
    <ResponsiveGrid viewMode={viewMode} ariaLabel="Wishlist books">
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
    </ResponsiveGrid>
  );
});

export default WishlistGrid;
