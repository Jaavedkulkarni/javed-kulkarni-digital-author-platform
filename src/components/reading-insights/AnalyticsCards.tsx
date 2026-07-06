import { memo } from 'react';
import { StatisticsGrid } from '../shared/statistics/StatisticsGrid';
import { StatisticItem } from '../shared/statistics/StatisticItem';
import { useReadingInsights } from '../../reader/hooks/useReadingInsights';
import { HeatmapPlaceholder } from './HeatmapPlaceholder';

export const AnalyticsCards = memo(function AnalyticsCards() {
  const { analytics: stats } = useReadingInsights();

  return (
    <div className="space-y-4 sm:space-y-5">
      <StatisticsGrid ariaLabel="Reading analytics" columnsClass="lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatisticItem
            key={stat.label}
            label={stat.label}
            value={stat.value}
            ariaLabel={`${stat.label}: ${stat.value}`}
          />
        ))}
      </StatisticsGrid>
      <HeatmapPlaceholder />
    </div>
  );
});

export default AnalyticsCards;
