import { memo, useEffect } from 'react';
import type { MockLibraryBook } from '../../data/mockLibraryBooks';
import type { LibraryViewMode } from '../../lib/libraryBookLogic';
import { ResponsiveGrid } from '../shared/layout/ResponsiveGrid';
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

  return (
    <ResponsiveGrid viewMode={viewMode} ariaLabel="Library books">
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
    </ResponsiveGrid>
  );
});

export default LibraryGrid;
