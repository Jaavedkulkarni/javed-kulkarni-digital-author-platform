import { memo } from 'react';
import type { SettingsLanguage } from '../../data/mockSettings';
import { DashboardCard } from '../dashboard/DashboardCard';
import { SettingsSelectRow } from './settingsUi';
import { DATE_FORMAT_OPTIONS, LANGUAGE_OPTIONS, TIME_FORMAT_OPTIONS } from './settingsTypes';

interface LanguageSettingsProps {
  language: SettingsLanguage;
  onUpdate: <K extends keyof SettingsLanguage>(key: K, value: SettingsLanguage[K]) => void;
}

export const LanguageSettings = memo(function LanguageSettings({
  language,
  onUpdate,
}: LanguageSettingsProps) {
  return (
    <DashboardCard title="Language" ariaLabel="Language settings">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SettingsSelectRow
          id="settings-preferred-language"
          label="Preferred Language"
          value={language.preferredLanguage}
          options={LANGUAGE_OPTIONS}
          onChange={(value) => onUpdate('preferredLanguage', value)}
        />
        <SettingsSelectRow
          id="settings-content-language"
          label="Content Language"
          value={language.contentLanguage}
          options={LANGUAGE_OPTIONS}
          onChange={(value) => onUpdate('contentLanguage', value)}
        />
        <SettingsSelectRow
          id="settings-date-format"
          label="Date Format"
          value={language.dateFormat}
          options={DATE_FORMAT_OPTIONS}
          onChange={(value) => onUpdate('dateFormat', value)}
        />
        <SettingsSelectRow
          id="settings-time-format"
          label="Time Format"
          value={language.timeFormat}
          options={TIME_FORMAT_OPTIONS}
          onChange={(value) => onUpdate('timeFormat', value)}
        />
      </div>
    </DashboardCard>
  );
});

export default LanguageSettings;
