import type { AuthorBook } from '../types/book.types';

interface BookListPanelProps {
  books: AuthorBook[];
  title?: string;
  isLoading?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'text-gray-400',
  review: 'text-amber-400',
  published: 'text-green-400',
  archived: 'text-red-400',
};

export function BookListPanel({ books, title = 'Books', isLoading }: BookListPanelProps) {
  if (isLoading) return <div className="text-sm text-gray-400">Loading books...</div>;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gold-400">{title}</h3>
      {books.length === 0 ? (
        <p className="text-sm text-gray-500">No books yet.</p>
      ) : (
        <ul className="divide-y divide-navy-700">
          {books.map((book) => (
            <li key={book.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{book.title}</p>
                <p className="text-xs text-gray-500">{book.slug}</p>
              </div>
              <span className={`text-xs capitalize ${STATUS_COLORS[book.workflow_status] ?? 'text-gray-400'}`}>
                {book.workflow_status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
