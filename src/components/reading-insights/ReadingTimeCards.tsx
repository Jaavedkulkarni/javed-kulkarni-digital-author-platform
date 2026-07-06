import { memo } from 'react';
import { StatisticsGrid } from '../shared/statistics/StatisticsGrid';
import { StatisticItem } from '../shared/statistics/StatisticItem';
import { useReadingInsights } from '../../reader/hooks/useReadingInsights';

export const ReadingTimeCards = memo(function ReadingTimeCards() {
  const { readingTime: stats } = useReadingInsights();

  return (
    <StatisticsGrid ariaLabel="Reading time statistics" columnsClass="lg:grid-cols-3">
      {stats.map((stat) => (
        <StatisticItem
          key={stat.label}
          label={stat.label}
          value={stat.value}
          ariaLabel={`${stat.label}: ${stat.value}`}
        />
      ))}
    </StatisticsGrid>
  );
});

export default ReadingTimeCards;
