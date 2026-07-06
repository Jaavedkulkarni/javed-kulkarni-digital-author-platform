import { memo } from 'react';
import { DashboardCard } from '../dashboard/DashboardCard';
import { SettingsDangerButton, SettingsPrimaryButton, SettingsSecondaryButton } from './settingsUi';

interface SettingsActionsProps {
  hasUnsavedChanges: boolean;
  saveMessage: string | null;
  onSave: () => void;
  onReset: () => void;
}

export const SettingsActions = memo(function SettingsActions({
  hasUnsavedChanges,
  saveMessage,
  onSave,
  onReset,
}: SettingsActionsProps) {
  return (
    <DashboardCard title="Actions" ariaLabel="Settings actions">
      {hasUnsavedChanges ? (
        <p className="mb-3 text-sm font-medium text-amber-700 dark:text-amber-300" role="status">
          You have unsaved changes.
        </p>
      ) : null}

      {saveMessage ? (
        <p className="mb-3 text-sm font-medium text-emerald-700 dark:text-emerald-300" role="status" aria-live="polite">
          {saveMessage}
        </p>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <SettingsPrimaryButton interactive={hasUnsavedChanges} onClick={onSave}>
          Save Changes
        </SettingsPrimaryButton>
        <SettingsSecondaryButton interactive={hasUnsavedChanges} onClick={onReset}>
          Reset Settings
        </SettingsSecondaryButton>
        <SettingsSecondaryButton placeholder title="Coming soon">
          Export Settings
        </SettingsSecondaryButton>
        <SettingsDangerButton placeholder title="Confirmation required — coming soon">
          Delete Account
        </SettingsDangerButton>
      </div>
    </DashboardCard>
  );
});

export default SettingsActions;
