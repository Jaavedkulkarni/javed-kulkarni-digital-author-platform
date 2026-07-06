import { useSettings } from '../../hooks/useSettings';
import { SettingsPageHeader } from './SettingsPageHeader';
import { AppearanceSettings } from './AppearanceSettings';
import { ReadingPreferences } from './ReadingPreferences';
import { NotificationPreferences } from './NotificationPreferences';
import { LanguageSettings } from './LanguageSettings';
import { DownloadSettings } from './DownloadSettings';
import { PrivacySettings } from './PrivacySettings';
import { AccountPreferences } from './AccountPreferences';
import { SettingsActions } from './SettingsActions';

export function SettingsContent() {
  const settings = useSettings();

  return (
    <div className="space-y-5 sm:space-y-6">
      <SettingsPageHeader />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        <AppearanceSettings appearance={settings.settings.appearance} onUpdate={settings.updateAppearance} />
        <ReadingPreferences
          reading={settings.settings.reading}
          onUpdate={settings.updateReading}
          onToggle={settings.toggleReading}
        />
      </div>

      <NotificationPreferences
        notifications={settings.settings.notifications}
        onToggle={settings.toggleNotification}
      />
      <LanguageSettings language={settings.settings.language} onUpdate={settings.updateLanguage} />
      <DownloadSettings downloads={settings.settings.downloads} onToggle={settings.toggleDownload} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        <PrivacySettings privacy={settings.settings.privacy} onToggle={settings.togglePrivacy} />
        <AccountPreferences />
      </div>

      <SettingsActions
        hasUnsavedChanges={settings.hasUnsavedChanges}
        saveMessage={settings.saveMessage}
        onSave={settings.saveChanges}
        onReset={settings.resetSettings}
      />
    </div>
  );
}

export default SettingsContent;
