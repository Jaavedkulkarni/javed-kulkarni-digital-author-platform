import { memo, useMemo } from 'react';
import { StatisticsGrid } from '../shared/statistics/StatisticsGrid';
import { StatisticItem } from '../shared/statistics/StatisticItem';
import { READING_TIME_MOCK } from './readingInsightsTypes';

export const ReadingTimeCards = memo(function ReadingTimeCards() {
  const stats = useMemo(() => READING_TIME_MOCK, []);

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
