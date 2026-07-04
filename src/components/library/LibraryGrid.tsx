import { memo, useEffect } from 'react';
import type { MockLibraryBook } from '../../data/mockLibraryBooks';
import type { LibraryViewMode } from '../../lib/libraryBookLogic';
import { LibraryBookItem } from './LibraryBookItem';
import { LibraryStatePanel } from './LibraryStatePanel';

interface LibraryGridProps {
  books: MockLibraryBook[];
  viewMode: LibraryViewMode;
  datasetEmpty: boolean;
  selectedBookId: string | null;
  onSelectBook: (bookId: string) => void;
  onClearSelection: () => void;
}

export const LibraryGrid = memo(function LibraryGrid({
  books,
  viewMode,
  datasetEmpty,
  selectedBookId,
  onSelectBook,
  onClearSelection,
}: LibraryGridProps) {
  useEffect(() => {
    if (selectedBookId && !books.some((book) => book.id === selectedBookId)) {
      onClearSelection();
    }
  }, [books, selectedBookId, onClearSelection]);

  if (datasetEmpty) {
    return <LibraryStatePanel variant="empty" />;
  }

  if (books.length === 0) {
    return <LibraryStatePanel variant="no-results" />;
  }

  const listClassName =
    viewMode === 'list'
      ? 'flex flex-col gap-4 sm:gap-5'
      : 'grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div role="list" aria-label="Library books" className={listClassName}>
      {books.map((book) => (
        <div key={book.id} role="listitem" className="h-full min-h-0">
          <LibraryBookItem
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

export default LibraryGrid;
