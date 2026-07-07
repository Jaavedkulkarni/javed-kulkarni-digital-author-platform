import { memo, useEffect, useRef, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface InfiniteTimelineListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getItemKey: (item: T) => string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  ariaLabel?: string;
}

function InfiniteTimelineListInner<T>({
  items,
  renderItem,
  getItemKey,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
  isLoading = false,
  isError = false,
  errorMessage,
  emptyMessage = 'No events found.',
  ariaLabel = 'Timeline events',
}: InfiniteTimelineListProps<T>) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNextPage || !onLoadMore || isFetchingNextPage) return undefined;
    const node = sentinelRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onLoadMore();
      },
      { rootMargin: '120px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  if (isLoading) {
    return <p className="text-sm text-gray-400">Loading timeline…</p>;
  }

  if (isError) {
    return <p className="text-sm text-red-400">{errorMessage ?? 'Unable to load timeline.'}</p>;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-navy-600 bg-navy-900/40 p-6 text-center">
        <p className="text-sm text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <ul className="divide-y divide-navy-700/80 overflow-hidden rounded-xl border border-navy-700 bg-navy-900/30" role="list" aria-label={ariaLabel}>
        {items.map((item, index) => (
          <li key={getItemKey(item)}>{renderItem(item, index)}</li>
        ))}
      </ul>
      <div ref={sentinelRef} className="h-4" aria-hidden="true" />
      {isFetchingNextPage ? (
        <div className="flex items-center justify-center gap-2 py-3 text-xs text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Loading more…
        </div>
      ) : null}
    </div>
  );
}

export const InfiniteTimelineList = memo(InfiniteTimelineListInner) as typeof InfiniteTimelineListInner;

export default InfiniteTimelineList;
