import { memo } from 'react';
import type { SettingsDownloads } from '../../data/mockSettings';
import { DashboardCard } from '../dashboard/DashboardCard';
import { StatisticsGrid } from '../shared/statistics/StatisticsGrid';
import { StatisticItem } from '../shared/statistics/StatisticItem';
import { SettingsInfoRow, SettingsToggleRow } from './settingsUi';

interface DownloadSettingsProps {
  downloads: SettingsDownloads;
  onToggle: (key: 'wifiOnly' | 'autoDeleteFinished') => void;
}

export const DownloadSettings = memo(function DownloadSettings({ downloads, onToggle }: DownloadSettingsProps) {
  return (
    <DashboardCard title="Downloads" ariaLabel="Download settings">
      <div className="space-y-5">
        <div className="divide-y divide-gray-100 dark:divide-navy-700">
          <SettingsToggleRow
            id="settings-wifi-only"
            label="Download over Wi-Fi only"
            checked={downloads.wifiOnly}
            onChange={() => onToggle('wifiOnly')}
          />
          <SettingsToggleRow
            id="settings-auto-delete"
            label="Auto Delete Finished Books"
            checked={downloads.autoDeleteFinished}
            onChange={() => onToggle('autoDeleteFinished')}
          />
        </div>

        <dl className="space-y-3">
          <SettingsInfoRow label="Offline Storage" value={downloads.offlineStorage} />
        </dl>

        <StatisticsGrid ariaLabel="Storage statistics" columnsClass="lg:grid-cols-2">
          <StatisticItem label="Storage Used" value={downloads.storageUsed} />
          <StatisticItem label="Available Storage" value={downloads.availableStorage} />
        </StatisticsGrid>
      </div>
    </DashboardCard>
  );
});

export default DownloadSettings;
