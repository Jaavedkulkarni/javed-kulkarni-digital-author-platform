import { memo } from 'react';
import { LayoutGrid, List } from 'lucide-react';

type ViewMode = 'grid' | 'list';

interface GridListToggleProps {
  viewMode?: ViewMode;
  onChange?: (mode: ViewMode) => void;
  disabled?: boolean;
}

export const GridListToggle = memo(function GridListToggle({
  viewMode = 'grid',
  onChange,
  disabled = false,
}: GridListToggleProps) {
  const gridActive = disabled ? true : viewMode === 'grid';
  const listActive = !disabled && viewMode === 'list';

  const activeClass = disabled
    ? 'inline-flex h-full items-center gap-1.5 rounded-md bg-brand px-3 text-sm font-medium text-white opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed'
    : 'inline-flex h-full items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 bg-brand text-white';

  const inactiveClass = disabled
    ? 'inline-flex h-full items-center gap-1.5 rounded-md px-3 text-sm font-medium text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-gray-400'
    : 'inline-flex h-full items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-navy-900/60';

  return (
    <div
      role="group"
      aria-label="View toggle"
      className="inline-flex h-10 items-center rounded-lg border border-gray-200 p-1 dark:border-navy-700"
    >
      <button
        type="button"
        disabled={disabled}
        aria-disabled={disabled || undefined}
        onClick={disabled ? undefined : () => onChange?.('grid')}
        aria-label="Grid view"
        aria-pressed={gridActive}
        className={gridActive ? activeClass : inactiveClass}
      >
        <LayoutGrid className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline">Grid</span>
      </button>
      <button
        type="button"
        disabled={disabled}
        aria-disabled={disabled || undefined}
        onClick={disabled ? undefined : () => onChange?.('list')}
        aria-label="List view"
        aria-pressed={listActive}
        className={listActive ? activeClass : inactiveClass}
      >
        <List className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline">List</span>
      </button>
    </div>
  );
});

export default GridListToggle;
