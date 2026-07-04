import { LibraryBookCard } from './LibraryBookCard';
import { LibraryEmptyState } from './LibraryEmptyState';
import type { LibraryBookItem } from './libraryTypes';

interface LibraryGridProps {
  books?: LibraryBookItem[];
}

export function LibraryGrid({ books = [] }: LibraryGridProps) {
  if (books.length === 0) {
    return <LibraryEmptyState />;
  }

  return (
    <div
      role="list"
      aria-label="Library books"
      className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {books.map((book) => (
        <div key={book.id} role="listitem">
          <LibraryBookCard book={book} />
        </div>
      ))}
    </div>
  );
}

export default LibraryGrid;
