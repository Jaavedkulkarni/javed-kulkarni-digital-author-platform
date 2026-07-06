import { memo } from 'react';
import { StatisticsGrid } from '../shared/statistics/StatisticsGrid';
import { StatisticItem } from '../shared/statistics/StatisticItem';
import { DashboardCard } from '../dashboard/DashboardCard';
import { useReaderProfile } from '../../reader/hooks/useReaderProfile';

const DOWNLOAD_STATS = [
  { label: 'Downloaded Books', key: 'downloadedBooks' as const },
  { label: 'Offline Storage', key: 'offlineStorage' as const },
  { label: 'Available Space', key: 'availableSpace' as const },
];

export const DownloadsSummary = memo(function DownloadsSummary() {
  const { downloads } = useReaderProfile();

  return (
    <DashboardCard title="Downloads Summary" ariaLabel="Downloads summary">
      <StatisticsGrid ariaLabel="Download statistics" columnsClass="lg:grid-cols-3">
        {DOWNLOAD_STATS.map((stat) => (
          <StatisticItem
            key={stat.key}
            label={stat.label}
            value={String(downloads[stat.key])}
            ariaLabel={`${stat.label}: ${downloads[stat.key]}`}
          />
        ))}
      </StatisticsGrid>
    </DashboardCard>
  );
});

export default DownloadsSummary;
