import { useReadingProgress } from '../../hooks/useReadingProgress';
import { ReadingProgressHeader } from './ReadingProgressHeader';
import { ReadingProgressToolbar } from './ReadingProgressToolbar';
import { ReadingStatistics } from './ReadingStatistics';
import { ReadingGrid } from './ReadingGrid';

interface ReadingProgressContentProps {
  embedded?: boolean;
}

export function ReadingProgressContent({ embedded = false }: ReadingProgressContentProps) {
  const reading = useReadingProgress();

  return (
    <div className={embedded ? 'space-y-4 sm:space-y-5' : 'space-y-5 sm:space-y-6'}>
      {!embedded ? <ReadingProgressHeader /> : null}
      <ReadingProgressToolbar
        searchQuery={reading.searchQuery}
        onSearchChange={reading.setSearchQuery}
        sortKey={reading.sortKey}
        onSortChange={reading.setSortKey}
        viewMode={reading.viewMode}
        onViewModeChange={reading.setViewMode}
        filters={reading.filters}
        onFilterChange={reading.updateFilter}
        onResetFilters={reading.resetFilters}
        filterOpen={reading.filterOpen}
        onFilterOpenChange={reading.setFilterOpen}
        filtersActive={reading.filtersActive}
        resultCount={reading.resultCount}
        languages={reading.filterOptions.languages}
        categories={reading.filterOptions.categories}
      />
      <ReadingStatistics stats={reading.stats} />
      <ReadingGrid
        items={reading.items}
        viewMode={reading.viewMode}
        datasetEmpty={reading.datasetEmpty}
        selectedRecordId={reading.selectedRecordId}
        onSelectRecord={reading.selectRecord}
        onClearSelection={reading.clearSelection}
      />
    </div>
  );
}

export default ReadingProgressContent;
