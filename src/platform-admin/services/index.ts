import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { createCmsServices } from '../../cms/services';
import { createNotificationRepository } from '../../lib/repositories/notificationRepository';
import { createPlatformAdminRepositories } from '../repositories';import { createPlatformAdminContextService } from './contextService';
import { createDashboardService } from './dashboardService';
import { createReviewService } from './reviewService';
import { createPaperbackService } from './paperbackService';
import { createFinanceService } from './financeService';
import { createSupportService } from './supportService';
import { createMarketingService } from './marketingService';
import { createAuthorServicesService } from './authorServicesService';
import { createLegalService } from './legalService';
import { createNotificationService } from './notificationService';
import { createPlatformAdminSecurityService } from './securityService';

export interface PlatformAdminServices {
  context: ReturnType<typeof createPlatformAdminContextService>;
  dashboard: ReturnType<typeof createDashboardService>;
  review: ReturnType<typeof createReviewService>;
  paperback: ReturnType<typeof createPaperbackService>;
  finance: ReturnType<typeof createFinanceService>;
  support: ReturnType<typeof createSupportService>;
  marketing: ReturnType<typeof createMarketingService>;
  authorServices: ReturnType<typeof createAuthorServicesService>;
  legal: ReturnType<typeof createLegalService>;
  notifications: ReturnType<typeof createNotificationService>;
  security: ReturnType<typeof createPlatformAdminSecurityService>;
}

export function createPlatformAdminServices(client: TypedSupabaseClient): PlatformAdminServices {
  const repos = createPlatformAdminRepositories(client);
  const cms = createCmsServices(client);
  const notifications = createNotificationRepository(client);
  const review = createReviewService(cms.books, cms.authors, notifications);
  return {
    context: createPlatformAdminContextService(repos.profile),
    dashboard: createDashboardService(),
    review,
    paperback: createPaperbackService(),
    finance: createFinanceService(),
    support: createSupportService(),
    marketing: createMarketingService(),
    authorServices: createAuthorServicesService(),
    legal: createLegalService(),
    notifications: createNotificationService(),
    security: createPlatformAdminSecurityService(),
  };
}

export {
  createPlatformAdminContextService,
  createDashboardService,
  createReviewService,
  createPaperbackService,
  createFinanceService,
  createSupportService,
  createMarketingService,
  createAuthorServicesService,
  createLegalService,
  createNotificationService,
  createPlatformAdminSecurityService,
};
