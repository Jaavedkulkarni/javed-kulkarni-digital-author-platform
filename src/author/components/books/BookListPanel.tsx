import type { AuthorBook } from '../types/book.types';

interface BookListPanelProps {
  books: AuthorBook[];
  title?: string;
  isLoading?: boolean;
  onSubmitForReview?: (bookId: string) => void;
  isSubmitting?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'text-gray-400',
  review: 'text-amber-400',
  published: 'text-green-400',
  archived: 'text-red-400',
};

export function BookListPanel({ books, title = 'Books', isLoading, onSubmitForReview, isSubmitting }: BookListPanelProps) {
  if (isLoading) return <div className="text-sm text-gray-400">Loading books...</div>;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gold-400">{title}</h3>
      {books.length === 0 ? (
        <p className="text-sm text-gray-500">No books yet.</p>
      ) : (
        <ul className="divide-y divide-navy-700">
          {books.map((book) => (
            <li key={book.id} className="py-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">{book.title}</p>
                <p className="text-xs text-gray-500">{book.slug}</p>
              </div>
              <div className="flex items-center gap-3">
              <span className={`text-xs capitalize ${STATUS_COLORS[book.workflow_status] ?? 'text-gray-400'}`}>
                {book.workflow_status}
              </span>
              {book.workflow_status === 'draft' && onSubmitForReview && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => onSubmitForReview(book.id)}
                  className="text-xs text-gold-400 hover:text-gold-300 disabled:opacity-50"
                >
                  Submit for Review
                </button>
              )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
