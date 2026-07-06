export type SettingsTheme = 'light' | 'dark' | 'system';
export type SettingsAccentColor = 'gold' | 'blue' | 'green' | 'purple';
export type SettingsFontSize = 'small' | 'medium' | 'large';
export type SettingsReadingMode = 'scroll' | 'pagination' | 'page-curl';
export type SettingsPageAnimation = 'on' | 'off';

export interface SettingsAppearance {
  theme: SettingsTheme;
  accentColor: SettingsAccentColor;
  fontSize: SettingsFontSize;
}

export interface SettingsReading {
  readingMode: SettingsReadingMode;
  pageAnimation: SettingsPageAnimation;
  autoBookmark: boolean;
  readingProgress: boolean;
  showCompletedBooks: boolean;
  openLastPageAutomatically: boolean;
}

export interface SettingsNotifications {
  orders: boolean;
  membership: boolean;
  reading: boolean;
  promotions: boolean;
  weeklySummary: boolean;
  push: boolean;
}

export interface SettingsLanguage {
  preferredLanguage: string;
  contentLanguage: string;
  dateFormat: string;
  timeFormat: string;
}

export interface SettingsDownloads {
  wifiOnly: boolean;
  autoDeleteFinished: boolean;
  offlineStorage: string;
  storageUsed: string;
  availableStorage: string;
}

export interface SettingsPrivacy {
  readingHistory: boolean;
  shareActivity: boolean;
  recommendations: boolean;
  analytics: boolean;
}

export interface ReaderSettings {
  appearance: SettingsAppearance;
  reading: SettingsReading;
  notifications: SettingsNotifications;
  language: SettingsLanguage;
  downloads: SettingsDownloads;
  privacy: SettingsPrivacy;
}

export const MOCK_ACCOUNT = {
  email: 'rajesh.patil@example.com',
  phone: '+91 98765 43210',
  password: '••••••••',
  connectedDevices: '2 devices',
  sessionManagement: 'Active session on this device',
};

export const MOCK_SETTINGS: ReaderSettings = {
  appearance: {
    theme: 'system',
    accentColor: 'gold',
    fontSize: 'medium',
  },
  reading: {
    readingMode: 'scroll',
    pageAnimation: 'on',
    autoBookmark: true,
    readingProgress: true,
    showCompletedBooks: true,
    openLastPageAutomatically: true,
  },
  notifications: {
    orders: true,
    membership: true,
    reading: true,
    promotions: false,
    weeklySummary: true,
    push: true,
  },
  language: {
    preferredLanguage: 'Marathi',
    contentLanguage: 'Marathi',
    dateFormat: 'DD MMM YYYY',
    timeFormat: '12-hour',
  },
  downloads: {
    wifiOnly: true,
    autoDeleteFinished: false,
    offlineStorage: '1.8 GB',
    storageUsed: '1.8 GB',
    availableStorage: '6.2 GB',
  },
  privacy: {
    readingHistory: true,
    shareActivity: false,
    recommendations: true,
    analytics: true,
  },
};
