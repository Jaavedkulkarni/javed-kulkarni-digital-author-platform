import { createCmsServices } from '../../cms/services';
import { getSupabaseFoundation } from '../../lib/supabase/index';
import type { ServiceContainer } from '../types/container.types';
import { createNotificationService } from './notificationService';
import { createAnalyticsService } from './analyticsService';
import { globalLogger } from './globalLogger';
import { CORE_LOG_SCOPES } from '../constants/app.constants';

export class DependencyContainer implements ServiceContainer {
  readonly auth;
  readonly cms;
  readonly storage;
  readonly database;
  readonly notifications;
  readonly analytics;

  constructor(foundation = getSupabaseFoundation()) {
    this.auth = foundation.auth;
    this.storage = foundation.storageService;
    this.database = foundation.database;
    this.cms = createCmsServices(foundation.client);
    this.notifications = createNotificationService(foundation.repositories.notifications);
    this.analytics = createAnalyticsService(foundation.database);

    globalLogger.info(CORE_LOG_SCOPES.container, 'Service container initialized');
  }

  get<K extends keyof ServiceContainer>(token: K): ServiceContainer[K] {
    return this[token];
  }
}

let containerInstance: DependencyContainer | null = null;

export function getServiceContainer(): DependencyContainer {
  if (!containerInstance) {
    containerInstance = new DependencyContainer();
  }
  return containerInstance;
}

export function resetServiceContainer(): void {
  containerInstance = null;
}

export function createServiceContainer(): DependencyContainer {
  return new DependencyContainer();
}
