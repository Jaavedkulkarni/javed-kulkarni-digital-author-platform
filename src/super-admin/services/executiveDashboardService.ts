import { getExecutiveOverview, getRecentActivities, getSystemStatus } from '../stores/executiveStore';

export class ExecutiveDashboardService {
  getOverview() { return getExecutiveOverview(); }
  getRecentActivities() { return getRecentActivities(); }
  getSystemStatus() { return getSystemStatus(); }
}

export function createExecutiveDashboardService(): ExecutiveDashboardService {
  return new ExecutiveDashboardService();
}
