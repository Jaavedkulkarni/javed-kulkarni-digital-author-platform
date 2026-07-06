import { createPublisherDashboardService } from './dashboardService';
import type { PublisherPerformanceMetrics } from '../types/dashboard.types';

export class PerformanceService {
  private readonly dashboard = createPublisherDashboardService();

  getMetrics(publisherId: string): PublisherPerformanceMetrics {
    return this.dashboard.getPerformance(publisherId);
  }
}

export function createPerformanceService(): PerformanceService {
  return new PerformanceService();
}
