import { memo } from 'react';

interface StatisticItemProps {
  label: string;
  value?: string;
  ariaLabel?: string;
}

export const StatisticItem = memo(function StatisticItem({
  label,
  value = '—',
  ariaLabel,
}: StatisticItemProps) {
  return (
    <div
      className="flex h-full min-h-[5.5rem] flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-navy-700 dark:bg-navy-800 sm:min-h-[6rem] sm:p-5"
      aria-label={ariaLabel ?? `${label}: ${value}`}
      role="group"
    >
      <p className="text-xs font-medium leading-snug text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-2 text-xl font-semibold tabular-nums text-navy-900 dark:text-white sm:text-2xl">
        {value}
      </p>
    </div>
  );
});

export default StatisticItem;
