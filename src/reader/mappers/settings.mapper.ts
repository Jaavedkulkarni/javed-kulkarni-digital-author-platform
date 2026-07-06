import type { UserSettings, Json } from '../../types/database';
import type { ReaderSettings } from '../../data/mockSettings';
import { MOCK_SETTINGS } from '../../data/mockSettings';
import { cloneSettings } from '../../lib/settingsLogic';

function parseSection<T>(value: unknown, fallback: T): T {
  if (!value || typeof value !== 'object') return fallback;
  return { ...fallback, ...(value as T) };
}

export function mapUserSettingsToReaderSettings(row: UserSettings | null): ReaderSettings {
  const defaults = cloneSettings(MOCK_SETTINGS);
  if (!row) return defaults;

  return {
    appearance: parseSection(row.appearance, defaults.appearance),
    reading: parseSection(row.reading, defaults.reading),
    notifications: parseSection(row.notifications, defaults.notifications),
    language: parseSection(row.language, defaults.language),
    downloads: parseSection(row.downloads, defaults.downloads),
    privacy: parseSection(row.privacy, defaults.privacy),
  };
}

export function mapReaderSettingsToUserSettingsPayload(settings: ReaderSettings): Partial<UserSettings> {
  return {
    appearance: settings.appearance as unknown as Json,
    reading: settings.reading as unknown as Json,
    notifications: settings.notifications as unknown as Json,
    language: settings.language as unknown as Json,
    downloads: settings.downloads as unknown as Json,
    privacy: settings.privacy as unknown as Json,
  };
}
