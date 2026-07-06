import { memo } from 'react';
import type { DownloadCardItem, DownloadViewMode } from './downloadTypes';
import { ResponsiveGrid } from '../shared/layout/ResponsiveGrid';
import { DownloadCard } from './DownloadCard';
import { DownloadStatePanel } from './DownloadStatePanel';

interface DownloadGridProps {
  items?: DownloadCardItem[];
  viewMode?: DownloadViewMode;
}

export const DownloadGrid = memo(function DownloadGrid({
  items = [],
  viewMode = 'grid',
}: DownloadGridProps) {
  if (items.length === 0) {
    return <DownloadStatePanel />;
  }

  return (
    <ResponsiveGrid viewMode={viewMode} ariaLabel="Downloaded books">
      {items.map((item) => (
        <div key={item.id} role="listitem" className="h-full min-h-0">
          <DownloadCard item={item} compact={viewMode === 'list'} />
        </div>
      ))}
    </ResponsiveGrid>
  );
});

export default DownloadGrid;
