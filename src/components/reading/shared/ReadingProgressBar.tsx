import { memo, useMemo } from 'react';

interface ReadingProgressBarProps {
  value?: number;
  currentPage?: number;
  totalPages?: number;
  label?: string;
  showPageCount?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

function clampProgress(value: number): number {
  return Math.min(100, Math.max(0, value));
}

export const ReadingProgressBar = memo(function ReadingProgressBar({
  value = 0,
  currentPage,
  totalPages,
  label = 'Reading Progress',
  showPageCount = true,
  size = 'md',
  className = '',
}: ReadingProgressBarProps) {
  const progress = useMemo(() => clampProgress(value), [value]);
  const barHeight = size === 'sm' ? 'h-1.5' : 'h-2.5';
  const pageLabel =
    currentPage !== undefined && totalPages !== undefined
      ? `${currentPage} / ${totalPages} pages`
      : null;

  return (
    <div className={className}>
      <div className="mb-1 flex items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span>{label}</span>
        <span className="tabular-nums font-medium text-navy-900 dark:text-white">{progress}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${progress}%`}
        className={`overflow-hidden rounded-full bg-gray-200 dark:bg-navy-700 ${barHeight}`}
      >
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {showPageCount && pageLabel ? (
        <p className="mt-1 text-xs tabular-nums text-gray-500 dark:text-gray-400">{pageLabel}</p>
      ) : null}
    </div>
  );
});

export default ReadingProgressBar;
