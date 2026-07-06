import { memo } from 'react';
import { StatisticsGrid } from '../shared/statistics/StatisticsGrid';
import { StatisticItem } from '../shared/statistics/StatisticItem';
import { DashboardCard } from '../dashboard/DashboardCard';
import { PROFILE_DOWNLOADS_PLACEHOLDER } from './profileTypes';

const DOWNLOAD_STATS: { label: string; key: keyof typeof PROFILE_DOWNLOADS_PLACEHOLDER }[] = [
  { label: 'Downloaded Books', key: 'downloadedBooks' },
  { label: 'Offline Storage', key: 'offlineStorage' },
  { label: 'Available Space', key: 'availableSpace' },
];

export const DownloadsSummary = memo(function DownloadsSummary() {
  const downloads = PROFILE_DOWNLOADS_PLACEHOLDER;

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
