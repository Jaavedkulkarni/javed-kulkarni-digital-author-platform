import { StatisticCard } from '../library/StatisticCard';

const DOWNLOAD_STATS = [
  { label: 'Total Downloads', value: '0' },
  { label: 'Downloaded Books', value: '0' },
  { label: 'Storage Used', value: '—' },
  { label: 'Offline Available', value: '0' },
] as const;

export function DownloadsStatistics() {
  return (
    <section
      aria-label="Downloads statistics"
      className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 lg:grid-cols-4"
    >
      {DOWNLOAD_STATS.map((stat) => (
        <StatisticCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          ariaLabel={`${stat.label}: ${stat.value}`}
        />
      ))}
    </section>
  );
}

export default DownloadsStatistics;
