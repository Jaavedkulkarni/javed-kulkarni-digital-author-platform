import { memo } from 'react';
import type { SettingsReading } from '../../data/mockSettings';
import { DashboardCard } from '../dashboard/DashboardCard';
import { SettingsRadioGroup, SettingsToggleRow } from './settingsUi';
import { PAGE_ANIMATION_OPTIONS, READING_MODE_OPTIONS } from './settingsTypes';

interface ReadingPreferencesProps {
  reading: SettingsReading;
  onUpdate: <K extends keyof SettingsReading>(key: K, value: SettingsReading[K]) => void;
  onToggle: (
    key: keyof Pick<
      SettingsReading,
      'autoBookmark' | 'readingProgress' | 'showCompletedBooks' | 'openLastPageAutomatically'
    >
  ) => void;
}

export const ReadingPreferences = memo(function ReadingPreferences({
  reading,
  onUpdate,
  onToggle,
}: ReadingPreferencesProps) {
  return (
    <DashboardCard title="Reading Preferences" ariaLabel="Reading preferences">
      <div className="space-y-4">
        <SettingsRadioGroup
          name="settings-reading-mode"
          label="Reading Mode"
          options={READING_MODE_OPTIONS}
          selected={reading.readingMode}
          onChange={(value) => onUpdate('readingMode', value as SettingsReading['readingMode'])}
        />
        <SettingsRadioGroup
          name="settings-page-animation"
          label="Page Animation"
          options={PAGE_ANIMATION_OPTIONS}
          selected={reading.pageAnimation}
          onChange={(value) => onUpdate('pageAnimation', value as SettingsReading['pageAnimation'])}
        />
        <div className="divide-y divide-gray-100 dark:divide-navy-700">
          <SettingsToggleRow
            id="settings-auto-bookmark"
            label="Auto Bookmark"
            checked={reading.autoBookmark}
            onChange={() => onToggle('autoBookmark')}
          />
          <SettingsToggleRow
            id="settings-reading-progress"
            label="Reading Progress"
            checked={reading.readingProgress}
            onChange={() => onToggle('readingProgress')}
          />
          <SettingsToggleRow
            id="settings-show-completed"
            label="Show Completed Books"
            checked={reading.showCompletedBooks}
            onChange={() => onToggle('showCompletedBooks')}
          />
          <SettingsToggleRow
            id="settings-open-last-page"
            label="Open Last Page Automatically"
            checked={reading.openLastPageAutomatically}
            onChange={() => onToggle('openLastPageAutomatically')}
          />
        </div>
      </div>
    </DashboardCard>
  );
});

export default ReadingPreferences;
