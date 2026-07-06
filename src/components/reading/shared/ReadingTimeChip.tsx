import { memo } from 'react';
import { Clock } from 'lucide-react';

interface ReadingTimeChipProps {
  label: string;
  value?: string;
  className?: string;
}

const PLACEHOLDER = '—';

export const ReadingTimeChip = memo(function ReadingTimeChip({
  label,
  value,
  className = '',
}: ReadingTimeChipProps) {
  return (
    <span
      className={`inline-flex min-h-6 items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:border-navy-600 dark:bg-navy-900/50 dark:text-gray-300 ${className}`}
      aria-label={`${label}: ${value ?? PLACEHOLDER}`}
    >
      <Clock className="h-3 w-3 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="tabular-nums text-navy-900 dark:text-white">{value ?? PLACEHOLDER}</span>
    </span>
  );
});

export default ReadingTimeChip;
