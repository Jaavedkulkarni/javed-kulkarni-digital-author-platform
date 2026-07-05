import type { DownloadCardItem, DownloadViewMode } from './downloadTypes';
import { DownloadCard } from './DownloadCard';
import { DownloadsEmptyState } from './DownloadsEmptyState';

interface DownloadsGridProps {
  items?: DownloadCardItem[];
  viewMode?: DownloadViewMode;
}

export function DownloadsGrid({ items = [], viewMode = 'grid' }: DownloadsGridProps) {
  if (items.length === 0) {
    return <DownloadsEmptyState />;
  }

  const listClassName =
    viewMode === 'list'
      ? 'flex flex-col gap-4 sm:gap-5'
      : 'grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div role="list" aria-label="Downloaded books" className={listClassName}>
      {items.map((item) => (
        <div key={item.id} role="listitem" className="h-full min-h-0">
          <DownloadCard item={item} compact={viewMode === 'list'} />
        </div>
      ))}
    </div>
  );
}

export default DownloadsGrid;
