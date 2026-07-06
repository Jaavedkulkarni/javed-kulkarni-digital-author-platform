import { memo } from 'react';
import type { SettingsAppearance } from '../../data/mockSettings';
import { DashboardCard } from '../dashboard/DashboardCard';
import { SettingsRadioGroup } from './settingsUi';
import { ACCENT_OPTIONS, FONT_SIZE_OPTIONS, THEME_OPTIONS } from './settingsTypes';

interface AppearanceSettingsProps {
  appearance: SettingsAppearance;
  onUpdate: <K extends keyof SettingsAppearance>(key: K, value: SettingsAppearance[K]) => void;
}

export const AppearanceSettings = memo(function AppearanceSettings({
  appearance,
  onUpdate,
}: AppearanceSettingsProps) {
  return (
    <DashboardCard title="Appearance" ariaLabel="Appearance settings">
      <div className="space-y-5">
        <SettingsRadioGroup
          name="settings-theme"
          label="Theme"
          options={THEME_OPTIONS}
          selected={appearance.theme}
          onChange={(value) => onUpdate('theme', value as SettingsAppearance['theme'])}
        />
        <SettingsRadioGroup
          name="settings-accent-color"
          label="Accent Color"
          options={ACCENT_OPTIONS}
          selected={appearance.accentColor}
          onChange={(value) => onUpdate('accentColor', value as SettingsAppearance['accentColor'])}
        />
        <SettingsRadioGroup
          name="settings-font-size"
          label="Font Size"
          options={FONT_SIZE_OPTIONS}
          selected={appearance.fontSize}
          onChange={(value) => onUpdate('fontSize', value as SettingsAppearance['fontSize'])}
        />
      </div>
    </DashboardCard>
  );
});

export default AppearanceSettings;
