import type { PlatformConfigItem } from '../types/config.types';
import { generateId } from '../utils/common';

const configs: PlatformConfigItem[] = [
  { id: generateId('cfg'), category: 'feature_flags', key: 'author-dashboard', value: 'enabled', description: 'Author dashboard feature' },
  { id: generateId('cfg'), category: 'feature_flags', key: 'publisher-dashboard', value: 'enabled', description: 'Publisher dashboard feature' },
  { id: generateId('cfg'), category: 'settings', key: 'platform_name', value: 'AuthorOS', description: 'Platform display name' },
  { id: generateId('cfg'), category: 'email', key: 'welcome_template', value: 'tmpl_welcome_v1', description: 'Welcome email template' },
  { id: generateId('cfg'), category: 'notification', key: 'order_confirmation', value: 'tmpl_order_v1', description: 'Order notification' },
  { id: generateId('cfg'), category: 'storage', key: 'books_bucket', value: 'books-media', description: 'Books storage bucket' },
  { id: generateId('cfg'), category: 'security', key: 'session_timeout', value: '24h', description: 'Session timeout' },
  { id: generateId('cfg'), category: 'api', key: 'rate_limit', value: '1000/min', description: 'API rate limit' },
  { id: generateId('cfg'), category: 'environment', key: 'env', value: 'production', description: 'Current environment' },
];

export function getPlatformConfig(category?: PlatformConfigItem['category']) {
  return category ? configs.filter((c) => c.category === category) : configs;
}

export function updateConfig(id: string, value: string): PlatformConfigItem | null {
  const c = configs.find((x) => x.id === id);
  if (!c) return null;
  c.value = value;
  return c;
}
