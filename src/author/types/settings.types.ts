export interface AuthorBrandingSettings {
  displayName: string | null;
  tagline: string | null;
  logoPath: string | null;
  coverPath: string | null;
  primaryColor: string;
  accentColor: string;
}

export interface AuthorSeoSettings {
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogImage: string | null;
  keywords: string[];
}

export interface AuthorNotificationPreferences {
  emailSales: boolean;
  emailReviews: boolean;
  emailPayouts: boolean;
  emailMarketing: boolean;
  pushEnabled: boolean;
}

export interface AuthorPaymentPreferences {
  preferredMethod: 'bank' | 'upi';
  minimumPayout: number;
  autoPayoutEnabled: boolean;
  payoutFrequency: 'weekly' | 'monthly' | 'manual';
}

export interface AuthorPrivacySettings {
  showEmail: boolean;
  showSalesCount: boolean;
  allowDirectMessages: boolean;
  profileVisibility: 'public' | 'members' | 'private';
}

export interface AuthorSettings {
  authorId: string;
  branding: AuthorBrandingSettings;
  seo: AuthorSeoSettings;
  notifications: AuthorNotificationPreferences;
  payment: AuthorPaymentPreferences;
  privacy: AuthorPrivacySettings;
  updatedAt: string;
}

export type AuthorSettingsSection = keyof Pick<AuthorSettings, 'branding' | 'seo' | 'notifications' | 'payment' | 'privacy'>;
