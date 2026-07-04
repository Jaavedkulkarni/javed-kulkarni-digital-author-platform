import { StatisticCard } from './StatisticCard';
import type { LibraryStats } from '../../lib/libraryBookLogic';

const LIBRARY_STATS = [
  { label: 'Total Books', key: 'total' as const },
  { label: 'Books Completed', key: 'completed' as const },
  { label: 'Books In Progress', key: 'inProgress' as const },
  { label: 'Unread Books', key: 'unread' as const },
  { label: 'Downloaded Books', key: 'downloaded' as const },
];

interface LibraryStatisticsProps {
  stats: LibraryStats;
}

export function LibraryStatistics({ stats }: LibraryStatisticsProps) {
  return (
    <section
      aria-label="Library statistics"
      className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 lg:grid-cols-5"
    >
      {LIBRARY_STATS.map((stat) => (
        <StatisticCard key={stat.key} label={stat.label} value={String(stats[stat.key])} />
      ))}
    </section>
  );
}

export default LibraryStatistics;
