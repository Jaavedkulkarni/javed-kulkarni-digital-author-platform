import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { createCmsServices } from '../../cms/services';
import { createAuthorRepositories } from '../repositories';
import { createAuthorContextService } from './contextService';
import { createAuthorBookManagementService } from './bookManagementService';
import { createAuthorAnalyticsService } from './analyticsService';
import { createAuthorRevenueService } from './revenueService';
import { createAuthorBlogService } from './blogService';
import { createAuthorProfileService } from './profileService';
import { createAuthorMediaService } from './mediaService';
import { createAuthorSocialService } from './socialService';
import { createAuthorWorkspaceService, createAuthorDashboardService } from './workspaceService';
import { createAuthorNotificationService } from './notificationService';
import { createEarningsPayoutsService } from './earningsPayoutsService';
import { createContractsService } from './contractsService';
import { createKycTaxService } from './kycTaxService';
import { createBookPerformanceService } from './bookPerformanceService';
import { createMarketingService } from './marketingService';
import { createImportExportService } from './importExportService';
import { createAuthorSettingsService } from './settingsService';
import { createMindWaveAiService } from '../ai/mindWaveAiService';

export interface AuthorServices {
  context: ReturnType<typeof createAuthorContextService>;
  books: ReturnType<typeof createAuthorBookManagementService>;
  analytics: ReturnType<typeof createAuthorAnalyticsService>;
  revenue: ReturnType<typeof createAuthorRevenueService>;
  blog: ReturnType<typeof createAuthorBlogService>;
  profile: ReturnType<typeof createAuthorProfileService>;
  media: ReturnType<typeof createAuthorMediaService>;
  social: ReturnType<typeof createAuthorSocialService>;
  workspace: ReturnType<typeof createAuthorWorkspaceService>;
  dashboard: ReturnType<typeof createAuthorDashboardService>;
  notifications: ReturnType<typeof createAuthorNotificationService>;
  earnings: ReturnType<typeof createEarningsPayoutsService>;
  contracts: ReturnType<typeof createContractsService>;
  kyc: ReturnType<typeof createKycTaxService>;
  performance: ReturnType<typeof createBookPerformanceService>;
  marketing: ReturnType<typeof createMarketingService>;
  importExport: ReturnType<typeof createImportExportService>;
  settings: ReturnType<typeof createAuthorSettingsService>;
  mindWaveAi: ReturnType<typeof createMindWaveAiService>;
}

export function createAuthorServices(client: TypedSupabaseClient): AuthorServices {
  const repos = createAuthorRepositories(client);
  const cms = createCmsServices(client);

  const analytics = createAuthorAnalyticsService(repos.analytics, repos.books);
  const revenue = createAuthorRevenueService();
  const earnings = createEarningsPayoutsService();
  const social = createAuthorSocialService();
  const performance = createBookPerformanceService(analytics, social);

  return {
    context: createAuthorContextService(repos.profile),
    books: createAuthorBookManagementService(repos.books, cms.books),
    analytics,
    revenue,
    blog: createAuthorBlogService(repos.blog),
    profile: createAuthorProfileService(cms.authors),
    media: createAuthorMediaService(),
    social,
    workspace: createAuthorWorkspaceService(),
    dashboard: createAuthorDashboardService(),
    notifications: createAuthorNotificationService(repos.notifications),
    earnings,
    contracts: createContractsService(),
    kyc: createKycTaxService(),
    performance,
    marketing: createMarketingService(),
    importExport: createImportExportService(revenue, earnings, performance, analytics),
    settings: createAuthorSettingsService(),
    mindWaveAi: createMindWaveAiService(),
  };
}

export {
  createAuthorContextService,
  createAuthorBookManagementService,
  createAuthorAnalyticsService,
  createAuthorRevenueService,
  createAuthorBlogService,
  createAuthorProfileService,
  createAuthorMediaService,
  createAuthorSocialService,
  createAuthorWorkspaceService,
  createAuthorDashboardService,
  createAuthorNotificationService,
  createEarningsPayoutsService,
  createContractsService,
  createKycTaxService,
  createBookPerformanceService,
  createMarketingService,
  createImportExportService,
  createAuthorSettingsService,
};
