import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReaderSettings } from '../data/mockSettings';
import { MOCK_SETTINGS } from '../data/mockSettings';
import {
  cloneSettings,
  getDefaultSettings,
  hasUnsavedSettingsChanges,
} from '../lib/settingsLogic';

const SAVE_MESSAGE_DURATION_MS = 3000;

export function useSettings() {
  const [settings, setSettings] = useState(() => cloneSettings(MOCK_SETTINGS));
  const [savedSettings, setSavedSettings] = useState(() => cloneSettings(MOCK_SETTINGS));
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const hasUnsavedChanges = useMemo(
    () => hasUnsavedSettingsChanges(settings, savedSettings),
    [settings, savedSettings]
  );

  useEffect(() => {
    if (!saveMessage) return;
    const timer = window.setTimeout(() => setSaveMessage(null), SAVE_MESSAGE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [saveMessage]);

  const updateAppearance = useCallback(
    <K extends keyof ReaderSettings['appearance']>(key: K, value: ReaderSettings['appearance'][K]) => {
      setSettings((prev) => ({
        ...prev,
        appearance: { ...prev.appearance, [key]: value },
      }));
    },
    []
  );

  const updateReading = useCallback(
    <K extends keyof ReaderSettings['reading']>(key: K, value: ReaderSettings['reading'][K]) => {
      setSettings((prev) => ({
        ...prev,
        reading: { ...prev.reading, [key]: value },
      }));
    },
    []
  );

  const toggleNotification = useCallback((key: keyof ReaderSettings['notifications']) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] },
    }));
  }, []);

  const updateLanguage = useCallback(
    <K extends keyof ReaderSettings['language']>(key: K, value: ReaderSettings['language'][K]) => {
      setSettings((prev) => ({
        ...prev,
        language: { ...prev.language, [key]: value },
      }));
    },
    []
  );

  const toggleDownload = useCallback((key: 'wifiOnly' | 'autoDeleteFinished') => {
    setSettings((prev) => ({
      ...prev,
      downloads: { ...prev.downloads, [key]: !prev.downloads[key] },
    }));
  }, []);

  const togglePrivacy = useCallback((key: keyof ReaderSettings['privacy']) => {
    setSettings((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: !prev.privacy[key] },
    }));
  }, []);

  const toggleReading = useCallback((key: keyof Pick<ReaderSettings['reading'], 'autoBookmark' | 'readingProgress' | 'showCompletedBooks' | 'openLastPageAutomatically'>) => {
    setSettings((prev) => ({
      ...prev,
      reading: { ...prev.reading, [key]: !prev.reading[key] },
    }));
  }, []);

  const saveChanges = useCallback(() => {
    setSavedSettings(cloneSettings(settings));
    setSaveMessage('Settings saved successfully.');
  }, [settings]);

  const resetSettings = useCallback(() => {
    const defaults = getDefaultSettings();
    setSettings(defaults);
    setSavedSettings(defaults);
    setSaveMessage(null);
  }, []);

  return {
    settings,
    hasUnsavedChanges,
    saveMessage,
    updateAppearance,
    updateReading,
    toggleReading,
    toggleNotification,
    updateLanguage,
    toggleDownload,
    togglePrivacy,
    saveChanges,
    resetSettings,
  };
}

export default useSettings;
