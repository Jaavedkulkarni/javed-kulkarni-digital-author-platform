export interface PlatformConfigItem {
  id: string;
  category: 'feature_flags' | 'settings' | 'email' | 'notification' | 'storage' | 'security' | 'api' | 'environment';
  key: string;
  value: string;
  description: string;
}
