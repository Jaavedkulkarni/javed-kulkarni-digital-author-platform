import { memo } from 'react';
import { Download, Filter, Plus, RefreshCw, Upload } from 'lucide-react';
import { SearchInput } from '../../../components/shared/search/SearchInput';
import { PrimaryButton } from '../../../components/shared/buttons/PrimaryButton';
import { SecondaryButton } from '../../../components/shared/buttons/SecondaryButton';
import {
  FILTER_INLINE_LABEL_CLASS,
  FILTER_INLINE_SELECT_CLASS,
  TOOLBAR_CONTROL_CLASS,
  TOOLBAR_SHELL_CLASS,
} from '../../../components/shared/constants';
import { PEOPLE_SORT_OPTIONS } from '../constants/people.constants';
import type { PeopleSortField } from '../types/people.types';

interface PeopleToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sort: PeopleSortField;
  onSortChange: (sort: PeopleSortField) => void;
  isFiltersOpen: boolean;
  onToggleFilters: () => void;
  onRefresh: () => void;
  onNewUser?: () => void;
  isRefreshing?: boolean;
  disabled?: boolean;
}

export const PeopleToolbar = memo(function PeopleToolbar({
  searchQuery,
  onSearchChange,
  sort,
  onSortChange,
  isFiltersOpen,
  onToggleFilters,
  onRefresh,
  onNewUser,
  isRefreshing = false,
  disabled = false,
}: PeopleToolbarProps) {
  return (
    <section aria-label="People actions" className={`${TOOLBAR_SHELL_CLASS} space-y-4`}>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <PrimaryButton placeholder interactive onClick={onNewUser} className="gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New User
          </PrimaryButton>
          <SecondaryButton placeholder disabled={false} className="gap-2">
            <Upload className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Import</span>
          </SecondaryButton>
          <SecondaryButton placeholder disabled={false} className="gap-2">
            <Download className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Export</span>
          </SecondaryButton>
        </div>

        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-end">
          <SearchInput
            id="people-search"
            label="Search people"
            placeholder="Search by name, email, phone, or user ID"
            value={searchQuery}
            onChange={onSearchChange}
            disabled={disabled}
          />
          <div className="min-w-[10rem]">
            <label htmlFor="people-sort" className={FILTER_INLINE_LABEL_CLASS}>
              Sort
            </label>
            <select
              id="people-sort"
              value={sort}
              onChange={(event) => onSortChange(event.target.value as PeopleSortField)}
              disabled={disabled}
              className={FILTER_INLINE_SELECT_CLASS}
            >
              {PEOPLE_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-expanded={isFiltersOpen}
              aria-controls="people-filters-panel"
              onClick={onToggleFilters}
              disabled={disabled}
              className={`${TOOLBAR_CONTROL_CLASS} gap-2 border-navy-600 bg-navy-900/60 px-3 hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <Filter className="h-4 w-4" aria-hidden="true" />
              Advanced Filters
            </button>
            <button
              type="button"
              onClick={onRefresh}
              disabled={disabled || isRefreshing}
              aria-label="Refresh people list"
              className={`${TOOLBAR_CONTROL_CLASS} gap-2 border-navy-600 bg-navy-900/60 px-3 hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

export default PeopleToolbar;
