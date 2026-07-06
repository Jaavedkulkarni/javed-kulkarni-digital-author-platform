import { useEffect, useRef } from 'react';
import type {
  WishlistAvailabilityFilter,
  WishlistFilters,
  WishlistSortKey,
  WishlistTriFilter,
  WishlistViewMode,
} from '../../lib/wishlistBookLogic';
import { PageToolbar } from '../shared/toolbar/PageToolbar';
import { SearchInput } from '../shared/search/SearchInput';
import { SortDropdown } from '../shared/sort/SortDropdown';
import { GridListToggle } from '../shared/toggle/GridListToggle';
import { FilterButton } from '../shared/filters/FilterButton';
import { FilterField, FilterPopover } from '../shared/filters/FilterPanel';

const SORT_OPTIONS: { value: WishlistSortKey; label: string }[] = [
  { value: 'recently-added', label: 'Recently Added' },
  { value: 'price-low', label: 'Price Low → High' },
  { value: 'price-high', label: 'Price High → Low' },
  { value: 'highest-discount', label: 'Highest Discount' },
  { value: 'a-z', label: 'A–Z' },
];

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

  return (
    <PageToolbar
      ariaLabel="Wishlist toolbar"
      announcement={`${resultCount} ${resultCount === 1 ? 'book' : 'books'} shown`}
    >
      <SearchInput
        id="wishlist-search"
        label="Search wishlist"
        placeholder="Search wishlist..."
        value={searchQuery}
        onChange={onSearchChange}
      />

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="relative" ref={filterRef}>
          <FilterButton
            ariaLabel={filtersActive ? 'Filter wishlist (filters active)' : 'Filter wishlist'}
            active={filtersActive}
            open={filterOpen}
            onClick={() => onFilterOpenChange(!filterOpen)}
          />
          <FilterPopover
            open={filterOpen}
            ariaLabel="Wishlist filters"
            onClose={() => onFilterOpenChange(false)}
            onReset={onResetFilters}
            filtersActive={filtersActive}
          >
            <FilterField id="wishlist-filter-language" label="Language" value={filters.language} onChange={(value) => onFilterChange('language', value)}>
              <option value="all">All Languages</option>
              {languages.map((language) => (
                <option key={language} value={language}>{language}</option>
              ))}
            </FilterField>
            <FilterField id="wishlist-filter-category" label="Category" value={filters.category} onChange={(value) => onFilterChange('category', value)}>
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </FilterField>
            <FilterField id="wishlist-filter-availability" label="Availability" value={filters.availability} onChange={(value) => onFilterChange('availability', value as WishlistAvailabilityFilter)}>
              <option value="all">All Availability</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="coming-soon">Coming Soon</option>
              <option value="membership">Membership</option>
            </FilterField>
            <FilterField id="wishlist-filter-membership" label="Membership" value={filters.membership} onChange={(value) => onFilterChange('membership', value as WishlistTriFilter)}>
              <option value="all">All</option>
              <option value="yes">Membership</option>
              <option value="no">Non-Membership</option>
            </FilterField>
            <FilterField id="wishlist-filter-discount" label="Discount" value={filters.discount} onChange={(value) => onFilterChange('discount', value as WishlistTriFilter)}>
              <option value="all">All</option>
              <option value="yes">On Discount</option>
              <option value="no">Full Price</option>
            </FilterField>
          </FilterPopover>
        </div>

        <SortDropdown id="wishlist-sort" label="Sort wishlist" options={SORT_OPTIONS} value={sortKey} onChange={onSortChange} />
        <GridListToggle viewMode={viewMode} onChange={onViewModeChange} />
      </div>
    </PageToolbar>
  );
}

export default WishlistToolbar;
