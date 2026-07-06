import { getAnalyticsSnapshot } from '../stores/analyticsStore';

export class AnalyticsService {
  getSnapshot() { return getAnalyticsSnapshot(); }
}

export function createAnalyticsService(): AnalyticsService {
  return new AnalyticsService();
}
