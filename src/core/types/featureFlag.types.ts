export type CoreFeatureFlag =
  | 'cms'
  | 'payments'
  | 'membership'
  | 'analytics'
  | 'hav-ai'
  | 'blog'
  | 'author-dashboard'
  | 'publisher-dashboard'
  | 'admin-dashboard';

export interface FeatureFlagDefinition {
  id: CoreFeatureFlag;
  label: string;
  description: string;
  defaultEnabled: boolean;
}

export interface FeatureFlagState {
  flags: Readonly<Record<CoreFeatureFlag, boolean>>;
  source: 'default' | 'config' | 'runtime';
}

export interface FeatureFlagOverride {
  flag: CoreFeatureFlag;
  enabled: boolean;
}
