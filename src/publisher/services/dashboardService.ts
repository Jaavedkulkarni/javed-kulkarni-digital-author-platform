import { getRfqs } from '../stores/rfqStore';
import { getQuotes } from '../stores/quoteStore';
import { getProductionJobs } from '../stores/productionJobStore';
import type { PublisherDashboardOverview, PublisherPerformanceMetrics } from '../types/dashboard.types';
import { isToday } from '../utils/common';

export class PublisherDashboardService {
  getOverview(publisherId: string): PublisherDashboardOverview {
    const quotes = getQuotes(publisherId);
    const jobs = getProductionJobs(publisherId);
    const rfqs = getRfqs(publisherId);

    const pendingQuotations = quotes.filter((q) => q.status === 'pending').length +
      rfqs.filter((r) => new Date(r.quoteDeadline) >= new Date() && !quotes.some((q) => q.rfqId === r.id && q.status === 'submitted')).length;

    const performance = this.computePerformance(publisherId, quotes, jobs);

    return {
      todaysProductionJobs: jobs.filter((j) => isToday(j.assignedDate)).length,
      pendingQuotations,
      submittedQuotations: quotes.filter((q) => q.status === 'submitted').length,
      wonQuotations: quotes.filter((q) => q.status === 'won').length,
      lostQuotations: quotes.filter((q) => q.status === 'lost').length,
      productionQueue: jobs.filter((j) =>
        !['completed', 'cancelled', 'ready_for_dispatch', 'dispatched', 'delivered'].includes(j.status)
      ).length,
      readyForDispatch: jobs.filter((j) => j.status === 'ready_for_dispatch').length,
      dispatched: jobs.filter((j) => j.status === 'dispatched').length,
      delivered: jobs.filter((j) => j.status === 'delivered').length,
      completedJobs: jobs.filter((j) => j.status === 'completed').length,
      cancelledJobs: jobs.filter((j) => j.status === 'cancelled').length,
      performance,
    };
  }

  getPerformance(publisherId: string): PublisherPerformanceMetrics {
    const quotes = getQuotes(publisherId);
    const jobs = getProductionJobs(publisherId);
    return this.computePerformance(publisherId, quotes, jobs);
  }

  private computePerformance(
    _publisherId: string,
    quotes: ReturnType<typeof getQuotes>,
    jobs: ReturnType<typeof getProductionJobs>
  ): PublisherPerformanceMetrics {
    const completed = jobs.filter((j) => j.status === 'completed');
    const cancelled = jobs.filter((j) => j.status === 'cancelled');
    const delayed = jobs.filter(
      (j) => j.status !== 'completed' && j.status !== 'cancelled' && new Date(j.expectedCompletion) < new Date()
    );
    const submittedQuotes = quotes.filter((q) => q.status === 'submitted' || q.status === 'won' || q.status === 'lost');
    const wonQuotes = quotes.filter((q) => q.status === 'won');
    const avgQuote =
      submittedQuotes.length > 0
        ? submittedQuotes.reduce((s, q) => s + q.totalAmount, 0) / submittedQuotes.length
        : 0;

    return {
      completedJobs: completed.length,
      cancelledJobs: cancelled.length,
      delayedJobs: delayed.length,
      averageProductionDays: 18,
      averageQuoteAmount: avgQuote,
      winRatio: submittedQuotes.length > 0 ? wonQuotes.length / submittedQuotes.length : 0,
      qualityRating: 4.6,
      deliveryRating: 4.4,
    };
  }
}

export function createPublisherDashboardService(): PublisherDashboardService {
  return new PublisherDashboardService();
}
