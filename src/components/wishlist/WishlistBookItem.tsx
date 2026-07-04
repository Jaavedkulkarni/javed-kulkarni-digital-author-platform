import { memo, useMemo } from 'react';
import type { MockWishlistBook } from '../../data/mockWishlistBooks';
import { toWishlistBookItem } from '../../lib/wishlistBookLogic';
import { WishlistBookCard } from './WishlistBookCard';

interface WishlistBookItemProps {
  book: MockWishlistBook;
  selected: boolean;
  onSelect: (bookId: string) => void;
  compact?: boolean;
}

export const WishlistBookItem = memo(function WishlistBookItem({
  book,
  selected,
  onSelect,
  compact = false,
}: WishlistBookItemProps) {
  const item = useMemo(() => toWishlistBookItem(book), [book]);

  return (
    <WishlistBookCard
      book={item}
      compact={compact}
      selected={selected}
      onSelect={() => onSelect(book.id)}
    />
  );
});

export default WishlistBookItem;
