import { memo } from 'react';
import { Filter } from 'lucide-react';
import { TOOLBAR_CONTROL_CLASS } from '../constants';

interface FilterButtonProps {
  label?: string;
  ariaLabel: string;
  active?: boolean;
  open?: boolean;
  disabled?: boolean;
  ariaControls?: string;
  onClick?: () => void;
}

export const FilterButton = memo(function FilterButton({
  label = 'Filter',
  ariaLabel,
  active = false,
  open = false,
  disabled = false,
  ariaControls,
  onClick,
}: FilterButtonProps) {
  if (disabled) {
    return (
      <button
        type="button"
        disabled
        aria-label={ariaLabel}
        aria-disabled="true"
        aria-controls={ariaControls}
        aria-expanded="false"
        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-navy-700 dark:text-gray-400"
      >
        <Filter className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={open}
      aria-haspopup="dialog"
      className={`${TOOLBAR_CONTROL_CLASS} gap-2 px-3 hover:bg-gray-50 dark:hover:bg-navy-900/60 ${
        active ? 'border-brand/40 bg-brand/5 dark:border-brand/30 dark:bg-brand/10' : ''
      }`}
    >
      <Filter className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{label}</span>
      {active ? (
        <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-brand" />
      ) : null}
    </button>
  );
});

export default FilterButton;
