import type { AuthClient } from '../../lib/supabase/auth/authClient';
import type { DatabaseService } from '../../lib/database/databaseService';
import type { StorageService } from '../../lib/storage/storageService';
import type { CmsServices } from '../../cms/services';
import type { NotificationService } from '../services/notificationService';
import type { AnalyticsService } from '../services/analyticsService';

export interface ServiceContainer {
  readonly auth: AuthClient;
  readonly cms: CmsServices;
  readonly storage: StorageService;
  readonly database: DatabaseService;
  readonly notifications: NotificationService;
  readonly analytics: AnalyticsService;
}

export type ServiceToken = keyof ServiceContainer;

export interface CoreFoundation {
  container: ServiceContainer;
  config: import('./config.types').CoreRuntimeConfig;
}
