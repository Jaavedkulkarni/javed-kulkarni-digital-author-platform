import type { ReaderSettings } from '../data/mockSettings';
import { MOCK_SETTINGS } from '../data/mockSettings';

export function cloneSettings(settings: ReaderSettings): ReaderSettings {
  return structuredClone(settings);
}

export function getDefaultSettings(): ReaderSettings {
  return cloneSettings(MOCK_SETTINGS);
}

export function settingsEqual(a: ReaderSettings, b: ReaderSettings): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function hasUnsavedSettingsChanges(current: ReaderSettings, saved: ReaderSettings): boolean {
  return !settingsEqual(current, saved);
}
