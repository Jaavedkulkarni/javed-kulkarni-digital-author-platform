import { memo } from 'react';
import { StatisticsGrid } from '../shared/statistics/StatisticsGrid';
import { StatisticItem } from '../shared/statistics/StatisticItem';
import { formatReadingDuration, type ReadingStats } from '../../lib/readingProgressLogic';

interface ReadingStatisticsProps {
  stats: ReadingStats;
}

const STAT_CONFIG: { label: string; key: keyof ReadingStats; format?: 'duration' | 'percent' }[] = [
  { label: 'Books Started', key: 'booksStarted' },
  { label: 'Books Completed', key: 'booksCompleted' },
  { label: 'Currently Reading', key: 'currentlyReading' },
  { label: 'Average Progress', key: 'averageProgress', format: 'percent' },
  { label: 'Reading Streak', key: 'readingStreak' },
  { label: 'Reading Time', key: 'readingTimeMinutes', format: 'duration' },
];

function formatStatValue(stats: ReadingStats, key: keyof ReadingStats, format?: 'duration' | 'percent') {
  const value = stats[key];
  if (format === 'duration') return formatReadingDuration(value as number);
  if (format === 'percent') return `${value}%`;
  return String(value);
}

export const ReadingStatistics = memo(function ReadingStatistics({ stats }: ReadingStatisticsProps) {
  return (
    <StatisticsGrid ariaLabel="Reading statistics" columnsClass="lg:grid-cols-3 xl:grid-cols-6">
      {STAT_CONFIG.map((stat) => (
        <StatisticItem
          key={stat.key}
          label={stat.label}
          value={formatStatValue(stats, stat.key, stat.format)}
          ariaLabel={`${stat.label}: ${formatStatValue(stats, stat.key, stat.format)}`}
        />
      ))}
    </StatisticsGrid>
  );
});

export default ReadingStatistics;
