import type { BookReviewItem, BlogReviewItem } from '../../types/review.types';
import type { ReviewDecision } from '../../types/common';

interface ContentReviewPanelProps {
  books?: BookReviewItem[];
  blogs?: BlogReviewItem[];
  isLoading?: boolean;
  onReview?: (id: string, decision: ReviewDecision, type: 'book' | 'blog') => void;
}

export function ContentReviewPanel({ books, blogs, isLoading, onReview }: ContentReviewPanelProps) {
  if (isLoading) return <p className="text-sm text-gray-400">Loading review queue...</p>;

  return (
    <div className="space-y-6">
      <section aria-label="Books review queue">
        <h3 className="text-sm font-medium text-white mb-3">Books Review Queue</h3>
        {!books?.length ? (
          <p className="text-sm text-gray-500">No books pending review.</p>
        ) : (
          <div className="space-y-2">
            {books.map((b) => (
              <div key={b.id} className="rounded-lg border border-navy-700 bg-navy-800/50 p-4 flex flex-wrap justify-between gap-3">
                <div>
                  <p className="text-sm text-white">{b.bookTitle}</p>
                  <p className="text-xs text-gray-500">{b.authorName} · {b.status}</p>
                </div>
                {b.status === 'pending' && onReview && (
                  <div className="flex gap-2">
                    <button type="button" onClick={() => onReview(b.id, 'approve', 'book')} className="text-xs px-3 py-1 rounded bg-green-600/20 text-green-400">Approve</button>
                    <button type="button" onClick={() => onReview(b.id, 'request_changes', 'book')} className="text-xs px-3 py-1 rounded bg-amber-600/20 text-amber-400">Request Changes</button>
                    <button type="button" onClick={() => onReview(b.id, 'reject', 'book')} className="text-xs px-3 py-1 rounded bg-red-600/20 text-red-400">Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
      <section aria-label="Blogs review queue">
        <h3 className="text-sm font-medium text-white mb-3">Blogs Review Queue</h3>
        {!blogs?.length ? (
          <p className="text-sm text-gray-500">No blogs pending review.</p>
        ) : (
          <div className="space-y-2">
            {blogs.map((b) => (
              <div key={b.id} className="rounded-lg border border-navy-700 bg-navy-800/50 p-4">
                <p className="text-sm text-white">{b.title}</p>
                <p className="text-xs text-gray-500">{b.authorName}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
