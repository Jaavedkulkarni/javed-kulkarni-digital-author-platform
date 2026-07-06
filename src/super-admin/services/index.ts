import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { createSuperAdminRepositories } from '../repositories';
import { createSuperAdminContextService } from './contextService';
import { createExecutiveDashboardService } from './executiveDashboardService';
import { createPeopleService } from './peopleService';
import { createPublisherManagementService } from './publisherManagementService';
import { createAuthorManagementService } from './authorManagementService';
import { createPlatformAdminService } from './platformAdminService';
import { createBusinessService } from './businessService';
import { createPlatformConfigurationService } from './platformConfigurationService';
import { createAnalyticsService } from './analyticsService';
import { createSecurityService, createAuditService } from './securityService';
import { createMindWaveConfigurationService } from './mindWaveConfigurationService';

export interface SuperAdminServices {
  context: ReturnType<typeof createSuperAdminContextService>;
  executive: ReturnType<typeof createExecutiveDashboardService>;
  people: ReturnType<typeof createPeopleService>;
  publishers: ReturnType<typeof createPublisherManagementService>;
  authors: ReturnType<typeof createAuthorManagementService>;
  platformAdmins: ReturnType<typeof createPlatformAdminService>;
  business: ReturnType<typeof createBusinessService>;
  platform: ReturnType<typeof createPlatformConfigurationService>;
  analytics: ReturnType<typeof createAnalyticsService>;
  security: ReturnType<typeof createSecurityService>;
  audit: ReturnType<typeof createAuditService>;
  mindWave: ReturnType<typeof createMindWaveConfigurationService>;
}

export function createSuperAdminServices(client: TypedSupabaseClient): SuperAdminServices {
  const repos = createSuperAdminRepositories(client);
  return {
    context: createSuperAdminContextService(repos.profile),
    executive: createExecutiveDashboardService(),
    people: createPeopleService(),
    publishers: createPublisherManagementService(),
    authors: createAuthorManagementService(),
    platformAdmins: createPlatformAdminService(),
    business: createBusinessService(),
    platform: createPlatformConfigurationService(),
    analytics: createAnalyticsService(),
    security: createSecurityService(),
    audit: createAuditService(),
    mindWave: createMindWaveConfigurationService(),
  };
}

export {
  createSuperAdminContextService,
  createExecutiveDashboardService,
  createPeopleService,
  createPublisherManagementService,
  createAuthorManagementService,
  createPlatformAdminService,
  createBusinessService,
  createPlatformConfigurationService,
  createAnalyticsService,
  createSecurityService,
  createAuditService,
  createMindWaveConfigurationService,
};
