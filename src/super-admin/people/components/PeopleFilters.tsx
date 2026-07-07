import { memo } from 'react';
import {
  FILTER_INLINE_LABEL_CLASS,
  FILTER_INLINE_SELECT_CLASS,
  TOOLBAR_SHELL_CLASS,
} from '../../../components/shared/constants';
import { PrimaryButton } from '../../../components/shared/buttons/PrimaryButton';
import type { PeopleFilterOptions } from '../types/people.types';
import type { PeopleFiltersInput } from '../schemas/people.schemas';

interface PeopleFiltersProps {
  open: boolean;
  filters: PeopleFiltersInput;
  filterOptions?: PeopleFilterOptions;
  optionsLoading?: boolean;
  onChange: <K extends keyof PeopleFiltersInput>(key: K, value: PeopleFiltersInput[K]) => void;
  onApply: () => void;
  onClear: () => void;
  disabled?: boolean;
}

function FilterSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-navy-700 bg-navy-800/50 p-4" aria-hidden="true">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-10 rounded-lg bg-navy-700" />
        ))}
      </div>
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className={FILTER_INLINE_LABEL_CLASS}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={FILTER_INLINE_SELECT_CLASS}
      >
        {options.map((option) => (
          <option key={option.value || 'all'} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export const PeopleFilters = memo(function PeopleFilters({
  open,
  filters,
  filterOptions,
  optionsLoading = false,
  onChange,
  onApply,
  onClear,
  disabled = false,
}: PeopleFiltersProps) {
  if (!open) return null;

  if (disabled || optionsLoading || !filterOptions) {
    return <FilterSkeleton />;
  }

  return (
    <section
      id="people-filters-panel"
      aria-label="Advanced filters"
      className={`${TOOLBAR_SHELL_CLASS} space-y-4`}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SelectField
          id="people-filter-role"
          label="Role"
          value={filters.role}
          options={filterOptions.roles}
          onChange={(value) => onChange('role', value)}
        />
        <SelectField
          id="people-filter-status"
          label="Status"
          value={filters.status}
          options={filterOptions.statuses}
          onChange={(value) => onChange('status', value)}
        />
        <SelectField
          id="people-filter-verification"
          label="Verification"
          value={filters.verification}
          options={filterOptions.verification}
          onChange={(value) => onChange('verification', value)}
        />
        <div>
          <label htmlFor="people-filter-date-from" className={FILTER_INLINE_LABEL_CLASS}>
            Date Range — From
          </label>
          <input
            id="people-filter-date-from"
            type="date"
            value={filters.dateFrom}
            onChange={(event) => onChange('dateFrom', event.target.value)}
            className={FILTER_INLINE_SELECT_CLASS}
          />
        </div>
        <div>
          <label htmlFor="people-filter-date-to" className={FILTER_INLINE_LABEL_CLASS}>
            Date Range — To
          </label>
          <input
            id="people-filter-date-to"
            type="date"
            value={filters.dateTo}
            onChange={(event) => onChange('dateTo', event.target.value)}
            className={FILTER_INLINE_SELECT_CLASS}
          />
        </div>
        <SelectField
          id="people-filter-country"
          label="Country"
          value={filters.country}
          options={filterOptions.countries}
          onChange={(value) => onChange('country', value)}
        />
        <div className="sm:col-span-2 lg:col-span-3">
          <label htmlFor="people-filter-search" className={FILTER_INLINE_LABEL_CLASS}>
            Search
          </label>
          <input
            id="people-filter-search"
            type="search"
            value={filters.search}
            onChange={(event) => onChange('search', event.target.value)}
            placeholder="Filter by name, email, phone, or user ID"
            className={FILTER_INLINE_SELECT_CLASS}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-navy-700 pt-4">
        <button
          type="button"
          onClick={onClear}
          className="inline-flex min-h-10 items-center rounded-lg border border-navy-600 bg-navy-900/60 px-4 text-sm font-medium text-gray-200 transition-colors hover:bg-navy-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
        >
          Clear Filters
        </button>
        <PrimaryButton placeholder interactive onClick={onApply} className="px-4">
          Apply Filters
        </PrimaryButton>
      </div>
    </section>
  );
});

export default PeopleFilters;
