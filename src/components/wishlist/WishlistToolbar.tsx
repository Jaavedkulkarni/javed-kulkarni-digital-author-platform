import { useEffect, useRef } from 'react';
import { Filter, LayoutGrid, List, Search, X } from 'lucide-react';
import type {
  WishlistAvailabilityFilter,
  WishlistFilters,
  WishlistSortKey,
  WishlistTriFilter,
  WishlistViewMode,
} from '../../lib/wishlistBookLogic';

const SORT_OPTIONS: { value: WishlistSortKey; label: string }[] = [
  { value: 'recently-added', label: 'Recently Added' },
  { value: 'price-low', label: 'Price Low → High' },
  { value: 'price-high', label: 'Price High → Low' },
  { value: 'highest-discount', label: 'Highest Discount' },
  { value: 'a-z', label: 'A–Z' },
];

const CONTROL_CLASS =
  'inline-flex min-h-10 items-center rounded-lg border border-gray-200 text-sm font-medium text-navy-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 dark:border-navy-700 dark:text-gray-200';

interface WishlistToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortKey: WishlistSortKey;
  onSortChange: (value: WishlistSortKey) => void;
  viewMode: WishlistViewMode;
  onViewModeChange: (mode: WishlistViewMode) => void;
  filters: WishlistFilters;
  onFilterChange: <K extends keyof WishlistFilters>(key: K, value: WishlistFilters[K]) => void;
  onResetFilters: () => void;
  filterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  filtersActive: boolean;
  resultCount: number;
  languages: string[];
  categories: string[];
}

export function WishlistToolbar({
  searchQuery,
  onSearchChange,
  sortKey,
  onSortChange,
  viewMode,
  onViewModeChange,
  filters,
  onFilterChange,
  onResetFilters,
  filterOpen,
  onFilterOpenChange,
  filtersActive,
  resultCount,
  languages,
  categories,
}: WishlistToolbarProps) {
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        onFilterOpenChange(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onFilterOpenChange(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [filterOpen, onFilterOpenChange]);

  const selectClass =
    'w-full min-h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-navy-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 dark:border-navy-700 dark:bg-navy-900/60 dark:text-gray-200';

  return (
    <section
      aria-label="Wishlist toolbar"
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-navy-700 dark:bg-navy-800 sm:p-5"
    >
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {resultCount} {resultCount === 1 ? 'book' : 'books'} shown
      </p>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative min-w-0 flex-1 lg:max-w-md">
          <label htmlFor="wishlist-search" className="sr-only">
            Search wishlist
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            aria-hidden="true"
          />
          <input
            id="wishlist-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search wishlist..."
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-navy-900 placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 dark:border-navy-700 dark:bg-navy-900/60 dark:text-white dark:placeholder:text-gray-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => onFilterOpenChange(!filterOpen)}
              aria-label={filtersActive ? 'Filter wishlist (filters active)' : 'Filter wishlist'}
              aria-expanded={filterOpen}
              aria-haspopup="dialog"
              className={`${CONTROL_CLASS} gap-2 px-3 hover:bg-gray-50 dark:hover:bg-navy-900/60 ${
                filtersActive ? 'border-brand/40 bg-brand/5 dark:border-brand/30 dark:bg-brand/10' : ''
              }`}
            >
              <Filter className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Filter</span>
              {filtersActive ? (
                <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-brand" />
              ) : null}
            </button>

            {filterOpen ? (
              <div
                role="dialog"
                aria-label="Wishlist filters"
                className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-navy-700 dark:bg-navy-800 sm:w-80"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-navy-900 dark:text-white">Filters</h3>
                  <button
                    type="button"
                    onClick={() => onFilterOpenChange(false)}
                    aria-label="Close filters"
                    className="inline-flex min-h-8 min-w-8 items-center justify-center rounded text-gray-400 transition-colors hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 dark:hover:text-gray-200"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="wishlist-filter-language" className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Language
                    </label>
                    <select
                      id="wishlist-filter-language"
                      value={filters.language}
                      onChange={(e) => onFilterChange('language', e.target.value)}
                      className={selectClass}
                    >
                      <option value="all">All Languages</option>
                      {languages.map((language) => (
                        <option key={language} value={language}>
                          {language}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="wishlist-filter-category" className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Category
                    </label>
                    <select
                      id="wishlist-filter-category"
                      value={filters.category}
                      onChange={(e) => onFilterChange('category', e.target.value)}
                      className={selectClass}
                    >
                      <option value="all">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="wishlist-filter-availability" className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Availability
                    </label>
                    <select
                      id="wishlist-filter-availability"
                      value={filters.availability}
                      onChange={(e) =>
                        onFilterChange('availability', e.target.value as WishlistAvailabilityFilter)
                      }
                      className={selectClass}
                    >
                      <option value="all">All Availability</option>
                      <option value="in-stock">In Stock</option>
                      <option value="out-of-stock">Out of Stock</option>
                      <option value="coming-soon">Coming Soon</option>
                      <option value="membership">Membership</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="wishlist-filter-membership" className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Membership
                    </label>
                    <select
                      id="wishlist-filter-membership"
                      value={filters.membership}
                      onChange={(e) => onFilterChange('membership', e.target.value as WishlistTriFilter)}
                      className={selectClass}
                    >
                      <option value="all">All</option>
                      <option value="yes">Membership</option>
                      <option value="no">Non-Membership</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="wishlist-filter-discount" className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Discount
                    </label>
                    <select
                      id="wishlist-filter-discount"
                      value={filters.discount}
                      onChange={(e) => onFilterChange('discount', e.target.value as WishlistTriFilter)}
                      className={selectClass}
                    >
                      <option value="all">All</option>
                      <option value="yes">On Discount</option>
                      <option value="no">Full Price</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onResetFilters}
                  disabled={!filtersActive}
                  className="mt-4 flex min-h-10 w-full items-center justify-center rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-navy-700 dark:text-gray-300 dark:hover:bg-navy-900/60"
                >
                  Reset Filters
                </button>
              </div>
            ) : null}
          </div>

          <div className="min-w-[10rem] flex-1 sm:flex-none">
            <label htmlFor="wishlist-sort" className="sr-only">
              Sort wishlist
            </label>
            <select
              id="wishlist-sort"
              value={sortKey}
              onChange={(e) => onSortChange(e.target.value as WishlistSortKey)}
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-navy-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 dark:border-navy-700 dark:bg-navy-900/60 dark:text-gray-200"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div
            role="group"
            aria-label="View toggle"
            className="inline-flex h-10 items-center rounded-lg border border-gray-200 p-1 dark:border-navy-700"
          >
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
              className={`inline-flex h-full items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 ${
                viewMode === 'grid'
                  ? 'bg-brand text-white'
                  : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-navy-900/60'
              }`}
            >
              <LayoutGrid className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
              className={`inline-flex h-full items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 ${
                viewMode === 'list'
                  ? 'bg-brand text-white'
                  : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-navy-900/60'
              }`}
            >
              <List className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WishlistToolbar;
