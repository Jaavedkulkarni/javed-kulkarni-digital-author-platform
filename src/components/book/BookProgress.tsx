interface BookProgressProps {
  value?: number;
  label?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  loading?: boolean;
}

function clampProgress(value: number): number {
  return Math.min(100, Math.max(0, value));
}

export function BookProgress({
  value = 0,
  label = 'Reading Progress',
  showLabel = true,
  size = 'md',
  className = '',
  loading = false,
}: BookProgressProps) {
  const progress = clampProgress(value);
  const displayValue = progress > 0 ? `${progress}%` : '—';
  const barHeight = size === 'sm' ? 'h-1.5' : 'h-2';

  if (loading) {
    return (
      <div className={`space-y-2 ${className}`} aria-hidden="true">
        <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-navy-700" />
        <div className={`${barHeight} animate-pulse rounded-full bg-gray-200 dark:bg-navy-700`} />
      </div>
    );
  }

  return (
    <div className={className}>
      {showLabel ? (
        <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{label}</span>
          <span>{displayValue}</span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className={`overflow-hidden rounded-full bg-gray-200 dark:bg-navy-700 ${barHeight}`}
      >
        <div
          className="h-full rounded-full bg-gold-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default BookProgress;
