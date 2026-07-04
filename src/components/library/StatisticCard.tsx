interface StatisticCardProps {
  label: string;
  value?: string;
  ariaLabel?: string;
}

export function StatisticCard({ label, value = '—', ariaLabel }: StatisticCardProps) {
  return (
    <div
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-navy-700 dark:bg-navy-800 sm:p-5"
      aria-label={ariaLabel ?? label}
    >
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-navy-900 dark:text-white sm:text-2xl">{value}</p>
    </div>
  );
}

export default StatisticCard;
