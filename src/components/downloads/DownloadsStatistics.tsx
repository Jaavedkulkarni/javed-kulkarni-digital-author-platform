import { StatisticsGrid } from '../shared/statistics/StatisticsGrid';
import { StatisticItem } from '../shared/statistics/StatisticItem';
import { DOWNLOAD_STATS_PLACEHOLDER } from './downloadTypes';

export function DownloadsStatistics() {
  return (
    <StatisticsGrid ariaLabel="Downloads statistics" columnsClass="lg:grid-cols-4">
      {DOWNLOAD_STATS_PLACEHOLDER.map((stat) => (
        <StatisticItem
          key={stat.label}
          label={stat.label}
          value={stat.value}
          ariaLabel={`${stat.label}: ${stat.value}`}
        />
      ))}
    </StatisticsGrid>
  );
}

export default DownloadsStatistics;
