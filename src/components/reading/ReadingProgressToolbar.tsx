import { useEffect, useRef, memo } from 'react';
import type { ReadingSortKey, ReadingViewMode } from './readingTypes';
import { READING_SORT_OPTIONS } from './readingTypes';
import type { ReadingFilters } from '../../lib/readingProgressLogic';
import { PageToolbar } from '../shared/toolbar/PageToolbar';
import { SearchInput } from '../shared/search/SearchInput';
import { SortDropdown } from '../shared/sort/SortDropdown';
import { GridListToggle } from '../shared/toggle/GridListToggle';
import { FilterButton } from '../shared/filters/FilterButton';
import { FilterField, FilterPopover } from '../shared/filters/FilterPanel';

interface ReadingProgressToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortKey: ReadingSortKey;
  onSortChange: (value: ReadingSortKey) => void;
  viewMode: ReadingViewMode;
  onViewModeChange: (mode: ReadingViewMode) => void;
  filters: ReadingFilters;
  onFilterChange: <K extends keyof ReadingFilters>(key: K, value: ReadingFilters[K]) => void;
  onResetFilters: () => void;
  filterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  filtersActive: boolean;
  resultCount: number;
  languages: string[];
  categories: string[];
}

export const ReadingProgressToolbar = memo(function ReadingProgressToolbar({
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
}: ReadingProgressToolbarProps) {
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
      ariaLabel="Reading progress toolbar"
      announcement={`${resultCount} ${resultCount === 1 ? 'book' : 'books'} shown`}
    >
      <SearchInput
        id="reading-search"
        label="Search reading progress"
        placeholder="Search books..."
        value={searchQuery}
        onChange={onSearchChange}
      />

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="relative" ref={filterRef}>
          <FilterButton
            ariaLabel={filtersActive ? 'Filter reading progress (filters active)' : 'Filter reading progress'}
            active={filtersActive}
            open={filterOpen}
            onClick={() => onFilterOpenChange(!filterOpen)}
          />
          <FilterPopover
            open={filterOpen}
            ariaLabel="Reading filters"
            onClose={() => onFilterOpenChange(false)}
            onReset={onResetFilters}
            filtersActive={filtersActive}
          >
            <FilterField
              id="reading-filter-status"
              label="Reading Status"
              value={filters.status}
              onChange={(value) => onFilterChange('status', value as ReadingFilters['status'])}
            >
              <option value="all">All Statuses</option>
              <option value="not-started">Not Started</option>
              <option value="reading">Reading</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </FilterField>

            <FilterField
              id="reading-filter-language"
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
              id="reading-filter-category"
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
              id="reading-filter-membership"
              label="Membership Books"
              value={filters.membershipBooks}
              onChange={(value) => onFilterChange('membershipBooks', value as ReadingFilters['membershipBooks'])}
            >
              <option value="all">All</option>
              <option value="yes">Membership</option>
              <option value="no">Non-Membership</option>
            </FilterField>

            <FilterField
              id="reading-filter-favorites"
              label="Favorites"
              value={filters.favorites}
              onChange={(value) => onFilterChange('favorites', value as ReadingFilters['favorites'])}
            >
              <option value="all">All</option>
              <option value="yes">Favorites</option>
              <option value="no">Not Favorites</option>
            </FilterField>

            <FilterField
              id="reading-filter-offline"
              label="Offline Available"
              value={filters.offlineAvailable}
              onChange={(value) => onFilterChange('offlineAvailable', value as ReadingFilters['offlineAvailable'])}
            >
              <option value="all">All</option>
              <option value="yes">Available</option>
              <option value="no">Not Available</option>
            </FilterField>
          </FilterPopover>
        </div>

        <SortDropdown
          id="reading-sort"
          label="Sort reading progress"
          options={READING_SORT_OPTIONS}
          value={sortKey}
          onChange={onSortChange}
        />

        <GridListToggle viewMode={viewMode} onChange={onViewModeChange} />
      </div>
    </PageToolbar>
  );
});

export default ReadingProgressToolbar;
