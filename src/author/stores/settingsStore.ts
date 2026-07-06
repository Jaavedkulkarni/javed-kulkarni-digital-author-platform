import type { AuthorSettings } from '../types/settings.types';

const DEFAULT_SETTINGS: Omit<AuthorSettings, 'authorId' | 'updatedAt'> = {
  branding: {
    displayName: null,
    tagline: null,
    logoPath: null,
    coverPath: null,
    primaryColor: '#1a1a2e',
    accentColor: '#b8860b',
  },
  seo: {
    metaTitle: null,
    metaDescription: null,
    canonicalUrl: null,
    ogImage: null,
    keywords: [],
  },
  notifications: {
    emailSales: true,
    emailReviews: true,
    emailPayouts: true,
    emailMarketing: false,
    pushEnabled: true,
  },
  payment: {
    preferredMethod: 'bank',
    minimumPayout: 500,
    autoPayoutEnabled: false,
    payoutFrequency: 'monthly',
  },
  privacy: {
    showEmail: false,
    showSalesCount: true,
    allowDirectMessages: true,
    profileVisibility: 'public',
  },
};

const settings = new Map<string, AuthorSettings>();

export function getAuthorSettings(authorId: string): AuthorSettings {
  return (
    settings.get(authorId) ?? {
      authorId,
      ...DEFAULT_SETTINGS,
      updatedAt: new Date().toISOString(),
    }
  );
}

export function updateAuthorSettings(
  authorId: string,
  section: keyof Pick<AuthorSettings, 'branding' | 'seo' | 'notifications' | 'payment' | 'privacy'>,
  patch: Partial<AuthorSettings[typeof section]>
): AuthorSettings {
  const current = getAuthorSettings(authorId);
  const updated: AuthorSettings = {
    ...current,
    [section]: { ...current[section], ...patch },
    updatedAt: new Date().toISOString(),
  };
  settings.set(authorId, updated);
  return updated;
}

export function resetSettingsStore(): void {
  settings.clear();
}
