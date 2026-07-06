import { StatisticsGrid } from '../shared/statistics/StatisticsGrid';
import { StatisticItem } from '../shared/statistics/StatisticItem';
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
    <StatisticsGrid ariaLabel="Library statistics" columnsClass="lg:grid-cols-5">
      {LIBRARY_STATS.map((stat) => (
        <StatisticItem key={stat.key} label={stat.label} value={String(stats[stat.key])} />
      ))}
    </StatisticsGrid>
  );
}

export default LibraryStatistics;
