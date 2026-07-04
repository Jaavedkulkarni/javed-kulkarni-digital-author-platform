/**
 * My Library UI Version 1.0 – Frozen
 * Sprint 02D — Production polish complete.
 */
import { useLibraryBooks } from '../../hooks/useLibraryBooks';
import { LibraryPageHeader } from './LibraryPageHeader';
import { LibraryToolbar } from './LibraryToolbar';
import { LibraryStatistics } from './LibraryStatistics';
import { LibraryGrid } from './LibraryGrid';

export function MyLibraryContent() {
  const library = useLibraryBooks();

  return (
    <div className="space-y-5 sm:space-y-6">
      <LibraryPageHeader />
      <LibraryToolbar
        searchQuery={library.searchQuery}
        onSearchChange={library.setSearchQuery}
        sortKey={library.sortKey}
        onSortChange={library.setSortKey}
        viewMode={library.viewMode}
        onViewModeChange={library.setViewMode}
        filters={library.filters}
        onFilterChange={library.updateFilter}
        onResetFilters={library.resetFilters}
        filterOpen={library.filterOpen}
        onFilterOpenChange={library.setFilterOpen}
        filtersActive={library.filtersActive}
        resultCount={library.books.length}
        languages={library.filterOptions.languages}
        categories={library.filterOptions.categories}
      />
      <LibraryStatistics stats={library.stats} />
      <LibraryGrid
        books={library.books}
        viewMode={library.viewMode}
        datasetEmpty={library.datasetEmpty}
        selectedBookId={library.selectedBookId}
        onSelectBook={library.selectBook}
        onClearSelection={library.clearSelection}
      />
    </div>
  );
}

export default MyLibraryContent;
