import { memo, useMemo } from 'react';
import { BookCard } from '../book';
import { toBookCardData } from '../../lib/libraryBookLogic';
import type { MockLibraryBook } from '../../data/mockLibraryBooks';
import { LibraryBookBadges } from './LibraryBookBadges';

interface LibraryBookItemProps {
  book: MockLibraryBook;
  selected: boolean;
  onSelect: (bookId: string) => void;
  compact?: boolean;
}

export const LibraryBookItem = memo(function LibraryBookItem({
  book,
  selected,
  onSelect,
  compact = false,
}: LibraryBookItemProps) {
  const cardData = useMemo(() => toBookCardData(book), [book]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <BookCard
        book={cardData}
        actionLabel="Continue Reading"
        showProgress
        compact={compact}
        className={`h-full ${compact ? 'w-full' : ''}`}
        selected={selected}
        onSelect={() => onSelect(book.id)}
      />
      <div className="min-h-7">
        <LibraryBookBadges book={book} />
      </div>
    </div>
  );
});

export default LibraryBookItem;
