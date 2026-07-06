import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ReaderSettings } from '../../data/mockSettings';
import { MOCK_ACCOUNT } from '../../data/mockSettings';
import {
  cloneSettings,
  getDefaultSettings,
  hasUnsavedSettingsChanges,
} from '../../lib/settingsLogic';
import { readerQueryKeys } from '../query/queryKeys';
import { fetchReaderSettings, saveReaderSettings } from '../services/settings.service';
import { useReader } from '../../context/ReaderContext';
import { useReaderUserId } from './useReaderUserId';
import { useOnlineStatus } from '../utils/offline';

const SAVE_MESSAGE_DURATION_MS = 3000;

export function useSettings() {
  const userId = useReaderUserId();
  const { user, profile } = useReader();
  const isOnline = useOnlineStatus();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState(() => cloneSettings(getDefaultSettings()));
  const [savedSettings, setSavedSettings] = useState(() => cloneSettings(getDefaultSettings()));
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const query = useQuery({
    queryKey: readerQueryKeys.settings(userId ?? 'guest'),
    queryFn: () => fetchReaderSettings(userId!),
    enabled: Boolean(userId) && isOnline,
  });

  useEffect(() => {
    if (!query.data) return;
    setSettings(cloneSettings(query.data));
    setSavedSettings(cloneSettings(query.data));
  }, [query.data]);

  useEffect(() => {
    if (!user) return;
    Object.assign(MOCK_ACCOUNT, {
      email: user.email ?? MOCK_ACCOUNT.email,
      phone: profile?.mobile ?? MOCK_ACCOUNT.phone,
    });
  }, [user, profile]);

  useEffect(() => {
    if (!saveMessage) return;
    const timer = window.setTimeout(() => setSaveMessage(null), SAVE_MESSAGE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [saveMessage]);

  const saveMutation = useMutation({
    mutationFn: (next: ReaderSettings) => saveReaderSettings(userId!, next),
    onSuccess: (persisted) => {
      const cloned = cloneSettings(persisted);
      setSettings(cloned);
      setSavedSettings(cloned);
      if (userId) {
        queryClient.setQueryData(readerQueryKeys.settings(userId), cloned);
      }
      setSaveMessage('Settings saved successfully.');
    },
  });

  const hasUnsavedChanges = useMemo(
    () => hasUnsavedSettingsChanges(settings, savedSettings),
    [settings, savedSettings]
  );

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

  const toggleReading = useCallback(
    (key: keyof Pick<ReaderSettings['reading'], 'autoBookmark' | 'readingProgress' | 'showCompletedBooks' | 'openLastPageAutomatically'>) => {
      setSettings((prev) => ({
        ...prev,
        reading: { ...prev.reading, [key]: !prev.reading[key] },
      }));
    },
    []
  );

  const saveChanges = useCallback(() => {
    if (!userId) return;
    saveMutation.mutate(settings);
  }, [saveMutation, settings, userId]);

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
    isLoading: query.isLoading,
    isSaving: saveMutation.isPending,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export default useSettings;
