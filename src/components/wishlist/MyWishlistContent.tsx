/**
 * Wishlist UI Version 1.0 — Frozen
 * Sprint 03C — Production polish complete.
 */
import { useCallback, useState } from 'react';
import { useWishlistBooks } from '../../hooks/useWishlistBooks';
import { WishlistPageHeader } from './WishlistPageHeader';
import { WishlistToolbar } from './WishlistToolbar';
import { WishlistStatistics } from './WishlistStatistics';
import { WishlistGrid } from './WishlistGrid';

export function MyWishlistContent() {
  const wishlist = useWishlistBooks();
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const selectBook = useCallback((bookId: string) => {
    setSelectedBookId(bookId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedBookId(null);
  }, []);

  return (
    <div className="space-y-5 sm:space-y-6">
      <WishlistPageHeader />
      <WishlistToolbar
        searchQuery={wishlist.searchQuery}
        onSearchChange={wishlist.setSearchQuery}
        sortKey={wishlist.sortKey}
        onSortChange={wishlist.setSortKey}
        viewMode={wishlist.viewMode}
        onViewModeChange={wishlist.setViewMode}
        filters={wishlist.filters}
        onFilterChange={wishlist.updateFilter}
        onResetFilters={wishlist.resetFilters}
        filterOpen={wishlist.filterOpen}
        onFilterOpenChange={wishlist.setFilterOpen}
        filtersActive={wishlist.filtersActive}
        resultCount={wishlist.books.length}
        languages={wishlist.filterOptions.languages}
        categories={wishlist.filterOptions.categories}
      />
      <WishlistStatistics stats={wishlist.stats} />
      <WishlistGrid
        books={wishlist.books}
        viewMode={wishlist.viewMode}
        datasetEmpty={wishlist.datasetEmpty}
        selectedBookId={selectedBookId}
        onSelectBook={selectBook}
        onClearSelection={clearSelection}
      />
    </div>
  );
}

export default MyWishlistContent;
