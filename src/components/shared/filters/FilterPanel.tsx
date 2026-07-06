import type { ReactNode } from 'react';
import { memo } from 'react';
import { X } from 'lucide-react';
import { FILTER_POPOVER_SELECT_CLASS } from '../constants';

interface FilterPopoverProps {
  open: boolean;
  ariaLabel: string;
  onClose: () => void;
  onReset: () => void;
  filtersActive: boolean;
  children: ReactNode;
}

export const FilterPopover = memo(function FilterPopover({
  open,
  ariaLabel,
  onClose,
  onReset,
  filtersActive,
  children,
}: FilterPopoverProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label={ariaLabel}
      className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-navy-700 dark:bg-navy-800 sm:w-80"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-navy-900 dark:text-white">Filters</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close filters"
          className="inline-flex min-h-8 min-w-8 items-center justify-center rounded text-gray-400 transition-colors hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 dark:hover:text-gray-200"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="space-y-3">{children}</div>

      <button
        type="button"
        onClick={onReset}
        disabled={!filtersActive}
        className="mt-4 flex min-h-10 w-full items-center justify-center rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-navy-700 dark:text-gray-300 dark:hover:bg-navy-900/60"
      >
        Reset Filters
      </button>
    </div>
  );
});

interface FilterFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  labelClassName?: string;
}

export const FilterField = memo(function FilterField({
  id,
  label,
  value,
  onChange,
  children,
  labelClassName = 'mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400',
}: FilterFieldProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={FILTER_POPOVER_SELECT_CLASS}
      >
        {children}
      </select>
    </div>
  );
});

interface FilterPanelProps {
  id: string;
  ariaLabel: string;
  open?: boolean;
  variant?: 'inline' | 'popover';
  children: ReactNode;
}

export const FilterPanel = memo(function FilterPanel({
  id,
  ariaLabel,
  open = false,
  variant = 'inline',
  children,
}: FilterPanelProps) {
  if (variant === 'popover') return null;

  return (
    <div
      id={id}
      role="region"
      aria-label={ariaLabel}
      hidden={!open}
      className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-navy-700 dark:bg-navy-900/40"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
    </div>
  );
});

export default FilterPanel;
