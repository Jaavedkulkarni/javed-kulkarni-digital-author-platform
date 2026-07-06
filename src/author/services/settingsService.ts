import type { AuthorSettings, AuthorSettingsSection } from '../types/settings.types';
import { getAuthorSettings, updateAuthorSettings } from '../stores/settingsStore';

export class AuthorSettingsService {
  get(authorId: string): AuthorSettings {
    return getAuthorSettings(authorId);
  }

  updateSection<S extends AuthorSettingsSection>(
    authorId: string,
    section: S,
    patch: Partial<AuthorSettings[S]>
  ): AuthorSettings {
    return updateAuthorSettings(authorId, section, patch);
  }
}

export function createAuthorSettingsService(): AuthorSettingsService {
  return new AuthorSettingsService();
}
