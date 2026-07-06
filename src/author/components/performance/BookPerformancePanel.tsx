import type { BookPerformanceDashboard } from '../../types/performance.types';

interface BookPerformancePanelProps {
  books: BookPerformanceDashboard[];
}

export function BookPerformancePanel({ books }: BookPerformancePanelProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gold-400">Book Performance</h3>
      {books.length === 0 ? (
        <p className="text-sm text-gray-500">No performance data yet.</p>
      ) : (
        <ul className="divide-y divide-navy-700">
          {books.map((book) => (
            <li key={book.bookId} className="py-3 flex justify-between items-center">
              <div>
                <p className="text-sm text-white">#{book.rank} {book.bookTitle}</p>
                <p className="text-xs text-gray-500">
                  {book.reads} reads · ₹{book.revenue} · {book.completionRate}% completion
                </p>
              </div>
              <span className={`text-xs ${book.trendDirection === 'up' ? 'text-green-400' : 'text-gray-400'}`}>
                {book.trendDirection === 'up' ? '↑' : book.trendDirection === 'down' ? '↓' : '→'} {book.trendPercent}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
