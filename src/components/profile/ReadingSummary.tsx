import { memo } from 'react';
import { StatisticsGrid } from '../shared/statistics/StatisticsGrid';
import { StatisticItem } from '../shared/statistics/StatisticItem';
import { DashboardCard } from '../dashboard/DashboardCard';
import { PROFILE_READING_PLACEHOLDER } from './profileTypes';

const READING_STATS: { label: string; key: keyof typeof PROFILE_READING_PLACEHOLDER }[] = [
  { label: 'Books Read', key: 'booksRead' },
  { label: 'Books Reading', key: 'booksReading' },
  { label: 'Wishlist', key: 'wishlist' },
  { label: 'Downloads', key: 'downloads' },
  { label: 'Hours Read', key: 'hoursRead' },
  { label: 'Reading Streak', key: 'readingStreak' },
];

export const ReadingSummary = memo(function ReadingSummary() {
  const reading = PROFILE_READING_PLACEHOLDER;

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
