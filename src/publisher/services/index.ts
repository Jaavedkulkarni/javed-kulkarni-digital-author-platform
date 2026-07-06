import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { createPublisherRepositories } from '../repositories';
import { createPublisherContextService } from './contextService';
import { createPublisherDashboardService } from './dashboardService';
import { createRfqService } from './rfqService';
import { createQuoteService } from './quoteService';
import { createProductionJobService } from './productionJobService';
import { createProofService } from './proofService';
import { createDispatchService } from './dispatchService';
import { createBillingService } from './billingService';
import { createCommunicationService } from './communicationService';
import { createCompanyProfileService } from './companyProfileService';
import { createPerformanceService } from './performanceService';
import { createPublisherSecurityService } from './securityService';

export interface PublisherServices {
  context: ReturnType<typeof createPublisherContextService>;
  dashboard: ReturnType<typeof createPublisherDashboardService>;
  rfq: ReturnType<typeof createRfqService>;
  quotes: ReturnType<typeof createQuoteService>;
  production: ReturnType<typeof createProductionJobService>;
  proofs: ReturnType<typeof createProofService>;
  dispatch: ReturnType<typeof createDispatchService>;
  billing: ReturnType<typeof createBillingService>;
  communication: ReturnType<typeof createCommunicationService>;
  company: ReturnType<typeof createCompanyProfileService>;
  performance: ReturnType<typeof createPerformanceService>;
  security: ReturnType<typeof createPublisherSecurityService>;
}

export function createPublisherServices(client: TypedSupabaseClient): PublisherServices {
  const repos = createPublisherRepositories(client);

  return {
    context: createPublisherContextService(repos.profile),
    dashboard: createPublisherDashboardService(),
    rfq: createRfqService(),
    quotes: createQuoteService(),
    production: createProductionJobService(),
    proofs: createProofService(),
    dispatch: createDispatchService(),
    billing: createBillingService(),
    communication: createCommunicationService(),
    company: createCompanyProfileService(),
    performance: createPerformanceService(),
    security: createPublisherSecurityService(),
  };
}

export {
  createPublisherContextService,
  createPublisherDashboardService,
  createRfqService,
  createQuoteService,
  createProductionJobService,
  createProofService,
  createDispatchService,
  createBillingService,
  createCommunicationService,
  createCompanyProfileService,
  createPerformanceService,
  createPublisherSecurityService,
};
