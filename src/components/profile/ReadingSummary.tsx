import { memo } from 'react';
import { StatisticsGrid } from '../shared/statistics/StatisticsGrid';
import { StatisticItem } from '../shared/statistics/StatisticItem';
import { DashboardCard } from '../dashboard/DashboardCard';
import { useReaderProfile } from '../../reader/hooks/useReaderProfile';

const READING_STATS = [
  { label: 'Books Read', key: 'booksRead' as const },
  { label: 'Books Reading', key: 'booksReading' as const },
  { label: 'Wishlist', key: 'wishlist' as const },
  { label: 'Downloads', key: 'downloads' as const },
  { label: 'Hours Read', key: 'hoursRead' as const },
  { label: 'Reading Streak', key: 'readingStreak' as const },
];

export const ReadingSummary = memo(function ReadingSummary() {
  const { reading } = useReaderProfile();

  return (
    <DashboardCard title="Reading Summary" ariaLabel="Reading summary">
      <StatisticsGrid ariaLabel="Reading statistics" columnsClass="lg:grid-cols-3 xl:grid-cols-6">
        {READING_STATS.map((stat) => (
          <StatisticItem
            key={stat.key}
            label={stat.label}
            value={String(reading[stat.key])}
            ariaLabel={`${stat.label}: ${reading[stat.key]}`}
          />
        ))}
      </StatisticsGrid>
    </DashboardCard>
  );
});

export default ReadingSummary;
