import { memo, useEffect } from 'react';
import type { ReadingCardItem, ReadingViewMode } from './readingTypes';
import { ResponsiveGrid } from '../shared/layout/ResponsiveGrid';
import { ReadingItem } from './ReadingItem';
import { ReadingStatePanel } from './ReadingStatePanel';

interface ReadingGridProps {
  items: ReadingCardItem[];
  viewMode: ReadingViewMode;
  datasetEmpty: boolean;
  selectedRecordId: string | null;
  onSelectRecord: (recordId: string) => void;
  onClearSelection: () => void;
}

export const ReadingGrid = memo(function ReadingGrid({
  items,
  viewMode,
  datasetEmpty,
  selectedRecordId,
  onSelectRecord,
  onClearSelection,
}: ReadingGridProps) {
  useEffect(() => {
    if (selectedRecordId && !items.some((item) => item.id === selectedRecordId)) {
      onClearSelection();
    }
  }, [items, selectedRecordId, onClearSelection]);

  if (datasetEmpty) {
    return <ReadingStatePanel variant="empty" />;
  }

  if (items.length === 0) {
    return <ReadingStatePanel variant="no-results" />;
  }

  return (
    <ResponsiveGrid viewMode={viewMode} ariaLabel="Reading progress books">
      {items.map((item) => (
        <div key={item.id} role="listitem" className="h-full min-h-0">
          <ReadingItem
            item={item}
            selected={selectedRecordId === item.id}
            onSelect={onSelectRecord}
            compact={viewMode === 'list'}
          />
        </div>
      ))}
    </ResponsiveGrid>
  );
});

export default ReadingGrid;
