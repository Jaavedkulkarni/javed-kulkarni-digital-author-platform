import type { ReviewSummary } from '../types/social.types';
import type { AuthorFollower, BookReview } from '../types/social.types';

interface ReaderInsightsPanelProps {
  followers: AuthorFollower[];
  reviews: BookReview[];
  summary: ReviewSummary | null;
}

export function ReaderInsightsPanel({ followers, reviews, summary }: ReaderInsightsPanelProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gold-400">Reader Insights</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded border border-navy-700 p-3">
          <p className="text-xs text-gray-400">Followers</p>
          <p className="text-lg font-semibold text-white">{followers.length}</p>
        </div>
        <div className="rounded border border-navy-700 p-3">
          <p className="text-xs text-gray-400">Reviews</p>
          <p className="text-lg font-semibold text-white">{summary?.totalReviews ?? 0}</p>
          {summary && summary.averageRating > 0 && (
            <p className="text-xs text-amber-400 mt-1">★ {summary.averageRating}</p>
          )}
        </div>
      </div>
      {reviews.length > 0 && (
        <ul className="space-y-2">
          {reviews.slice(0, 3).map((r) => (
            <li key={r.id} className="text-sm border-l-2 border-gold-500/30 pl-3">
              <p className="text-white">{r.reviewerName} — {'★'.repeat(r.rating)}</p>
              <p className="text-gray-400 text-xs">{r.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
