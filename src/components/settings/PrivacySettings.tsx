import { memo } from 'react';
import type { SettingsPrivacy } from '../../data/mockSettings';
import { DashboardCard } from '../dashboard/DashboardCard';
import { SettingsToggleRow } from './settingsUi';

interface PrivacySettingsProps {
  privacy: SettingsPrivacy;
  onToggle: (key: keyof SettingsPrivacy) => void;
}

export const PrivacySettings = memo(function PrivacySettings({ privacy, onToggle }: PrivacySettingsProps) {
  return (
    <DashboardCard title="Privacy" ariaLabel="Privacy settings">
      <div className="divide-y divide-gray-100 dark:divide-navy-700">
        <SettingsToggleRow
          id="settings-reading-history"
          label="Reading History"
          checked={privacy.readingHistory}
          onChange={() => onToggle('readingHistory')}
        />
        <SettingsToggleRow
          id="settings-share-activity"
          label="Share Reading Activity"
          checked={privacy.shareActivity}
          onChange={() => onToggle('shareActivity')}
        />
        <SettingsToggleRow
          id="settings-recommendations"
          label="Personalized Recommendations"
          checked={privacy.recommendations}
          onChange={() => onToggle('recommendations')}
        />
        <SettingsToggleRow
          id="settings-analytics"
          label="Analytics"
          checked={privacy.analytics}
          onChange={() => onToggle('analytics')}
        />
      </div>
    </DashboardCard>
  );
});

export default PrivacySettings;
