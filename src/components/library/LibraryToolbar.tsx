import { useEffect, useRef } from 'react';
import type {
  LibraryFilters,
  LibrarySortKey,
  LibraryTriFilter,
  LibraryViewMode,
} from '../../lib/libraryBookLogic';
import type { LibraryStatusFilter } from '../../lib/libraryBookLogic';
import { PageToolbar } from '../shared/toolbar/PageToolbar';
import { SearchInput } from '../shared/search/SearchInput';
import { SortDropdown } from '../shared/sort/SortDropdown';
import { GridListToggle } from '../shared/toggle/GridListToggle';
import { FilterButton } from '../shared/filters/FilterButton';
import { FilterField, FilterPopover } from '../shared/filters/FilterPanel';

const SORT_OPTIONS: { value: LibrarySortKey; label: string }[] = [
  { value: 'recently-added', label: 'Recently Added' },
  { value: 'recently-opened', label: 'Recently Opened' },
  { value: 'a-z', label: 'A–Z' },
  { value: 'reading-progress', label: 'Reading Progress' },
  { value: 'purchase-date', label: 'Purchase Date' },
];

interface LibraryToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortKey: LibrarySortKey;
  onSortChange: (value: LibrarySortKey) => void;
  viewMode: LibraryViewMode;
  onViewModeChange: (mode: LibraryViewMode) => void;
  filters: LibraryFilters;
  onFilterChange: <K extends keyof LibraryFilters>(key: K, value: LibraryFilters[K]) => void;
  onResetFilters: () => void;
  filterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  filtersActive: boolean;
  resultCount: number;
  languages: string[];
  categories: string[];
}

export function LibraryToolbar({
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
}: LibraryToolbarProps) {
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
      ariaLabel="Library toolbar"
      announcement={`${resultCount} ${resultCount === 1 ? 'book' : 'books'} shown`}
    >
      <SearchInput
        id="library-search"
        label="Search books"
        placeholder="Search books..."
        value={searchQuery}
        onChange={onSearchChange}
      />

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="relative" ref={filterRef}>
          <FilterButton
            ariaLabel={filtersActive ? 'Filter books (filters active)' : 'Filter books'}
            active={filtersActive}
            open={filterOpen}
            onClick={() => onFilterOpenChange(!filterOpen)}
          />
          <FilterPopover
            open={filterOpen}
            ariaLabel="Library filters"
            onClose={() => onFilterOpenChange(false)}
            onReset={onResetFilters}
            filtersActive={filtersActive}
          >
            <FilterField
              id="filter-language"
              label="Language"
              value={filters.language}
              onChange={(value) => onFilterChange('language', value)}
            >
              <option value="all">All Languages</option>
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </FilterField>

            <FilterField
              id="filter-category"
              label="Category"
              value={filters.category}
              onChange={(value) => onFilterChange('category', value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </FilterField>

            <FilterField
              id="filter-status"
              label="Status"
              value={filters.status}
              onChange={(value) => onFilterChange('status', value as LibraryStatusFilter)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="unread">Unread</option>
            </FilterField>

            <FilterField
              id="filter-downloaded"
              label="Downloaded"
              value={filters.downloaded}
              onChange={(value) => onFilterChange('downloaded', value as LibraryTriFilter)}
            >
              <option value="all">All</option>
              <option value="yes">Downloaded</option>
              <option value="no">Not Downloaded</option>
            </FilterField>

            <FilterField
              id="filter-membership"
              label="Membership"
              value={filters.membership}
              onChange={(value) => onFilterChange('membership', value as LibraryTriFilter)}
            >
              <option value="all">All</option>
              <option value="yes">Membership</option>
              <option value="no">Non-Membership</option>
            </FilterField>
          </FilterPopover>
        </div>

        <SortDropdown
          id="library-sort"
          label="Sort books"
          options={SORT_OPTIONS}
          value={sortKey}
          onChange={onSortChange}
        />

        <GridListToggle viewMode={viewMode} onChange={onViewModeChange} />
      </div>
    </PageToolbar>
  );
}

export default LibraryToolbar;
