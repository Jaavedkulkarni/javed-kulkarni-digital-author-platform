import { memo } from 'react';
import { StatisticsGrid } from '../shared/statistics/StatisticsGrid';
import { StatisticItem } from '../shared/statistics/StatisticItem';
import { ReadingCalendar } from './ReadingCalendar';
import { useReadingInsights } from '../../reader/hooks/useReadingInsights';

export const ReadingStreakCards = memo(function ReadingStreakCards() {
  const { streak: stats } = useReadingInsights();

  return (
    <div className="space-y-4 sm:space-y-5">
      <StatisticsGrid ariaLabel="Reading streak statistics" columnsClass="lg:grid-cols-3">
        {stats.map((stat) => (
          <StatisticItem
            key={stat.label}
            label={stat.label}
            value={stat.value}
            ariaLabel={`${stat.label}: ${stat.value}`}
          />
        ))}
      </StatisticsGrid>
      <ReadingCalendar />
    </div>
  );
});

export default ReadingStreakCards;
