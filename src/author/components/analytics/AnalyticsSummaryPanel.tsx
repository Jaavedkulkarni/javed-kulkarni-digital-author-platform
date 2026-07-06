import type { AuthorAnalyticsSummary } from '../types/analytics.types';

interface AnalyticsSummaryPanelProps {
  analytics: AuthorAnalyticsSummary | null | undefined;
}

export function AnalyticsSummaryPanel({ analytics }: AnalyticsSummaryPanelProps) {
  if (!analytics) return null;

  const metrics = [
    { label: 'Books Sold', value: analytics.booksSold },
    { label: 'Revenue', value: `₹${analytics.revenue.toLocaleString('en-IN')}` },
    { label: 'Reads', value: analytics.reads },
    { label: 'Reading Time', value: `${analytics.readingTimeMinutes} min` },
    { label: 'Completion Rate', value: `${analytics.completionRate}%` },
    { label: 'Bookmarks', value: analytics.bookmarks },
    { label: 'Highlights', value: analytics.highlights },
    { label: 'Notes', value: analytics.notes },
    { label: 'Downloads', value: analytics.downloads },
    { label: 'Wishlist', value: analytics.wishlistCount },
    { label: 'Conversion', value: `${analytics.conversionRate}%` },
    { label: 'Returning Readers', value: analytics.returningReaders },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gold-400">Analytics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="rounded border border-navy-700 p-3">
            <p className="text-xs text-gray-400">{m.label}</p>
            <p className="text-sm font-medium text-white">{m.value}</p>
          </div>
        ))}
      </div>
      {analytics.topCountries.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-2">Top Countries</p>
          <div className="flex flex-wrap gap-2">
            {analytics.topCountries.map((c) => (
              <span key={c.country} className="text-xs bg-navy-700 px-2 py-1 rounded text-gray-300">
                {c.country}: {c.count}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
