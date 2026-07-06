import type { Tables } from '../../types/database';
import { withRetry } from '../../lib/utils/retry';
import { getReaderDataAccess } from '../infrastructure/readerDataAccess';
import {
  mapReaderSettingsToUserSettingsPayload,
  mapUserSettingsToReaderSettings,
} from '../mappers/settings.mapper';
import type { ReaderSettings } from '../../data/mockSettings';
import { getDefaultSettings } from '../../lib/settingsLogic';

export async function fetchReaderSettings(userId: string): Promise<ReaderSettings> {
  const { repositories } = getReaderDataAccess();
  const row = await withRetry(
    async () => repositories.userSettings.findByUserId(userId),
    { scope: 'reader.settings.fetch' }
  );
  return mapUserSettingsToReaderSettings(row);
}

export async function saveReaderSettings(userId: string, settings: ReaderSettings): Promise<ReaderSettings> {
  const { repositories } = getReaderDataAccess();
  const payload = mapReaderSettingsToUserSettingsPayload(settings);
  const existing = await repositories.userSettings.findByUserId(userId);

  if (existing) {
    const updated = await repositories.userSettings.updateSettings(existing.id, payload);
    return mapUserSettingsToReaderSettings(updated);
  }

  const created = await repositories.userSettings.createSettings({
    user_id: userId,
    appearance: (payload.appearance ?? getDefaultSettings().appearance) as unknown as Tables<'user_settings'>['appearance'],
    reading: (payload.reading ?? getDefaultSettings().reading) as unknown as Tables<'user_settings'>['reading'],
    notifications: (payload.notifications ?? getDefaultSettings().notifications) as unknown as Tables<'user_settings'>['notifications'],
    language: (payload.language ?? getDefaultSettings().language) as unknown as Tables<'user_settings'>['language'],
    downloads: (payload.downloads ?? getDefaultSettings().downloads) as unknown as Tables<'user_settings'>['downloads'],
    privacy: (payload.privacy ?? getDefaultSettings().privacy) as unknown as Tables<'user_settings'>['privacy'],
  });

  return mapUserSettingsToReaderSettings(created);
}
