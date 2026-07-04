import { StatisticCard } from './StatisticCard';

const LIBRARY_STATS = [
  { label: 'Total Books', key: 'total' },
  { label: 'Books Completed', key: 'completed' },
  { label: 'Books In Progress', key: 'inProgress' },
  { label: 'Unread Books', key: 'unread' },
  { label: 'Downloaded Books', key: 'downloaded' },
] as const;

export function LibraryStatistics() {
  return (
    <section aria-label="Library statistics" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
      {LIBRARY_STATS.map((stat) => (
        <StatisticCard key={stat.key} label={stat.label} />
      ))}
    </section>
  );
}

export default LibraryStatistics;
