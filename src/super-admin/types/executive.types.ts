import type { SystemHealthStatus } from './common';

export interface ExecutiveDashboardOverview {
  platformHealth: SystemHealthStatus;
  todaysRevenue: number;
  monthlyRevenue: number;
  booksSold: number;
  orders: number;
  memberships: number;
  readers: number;
  authors: number;
  publishers: number;
  platformAdmins: number;
  pendingReviews: number;
  pendingPublisherApprovals: number;
  pendingWithdrawals: number;
  supportQueue: number;
  paperbackProduction: number;
  storageUsageGb: number;
  storageLimitGb: number;
}

export interface ExecutiveActivity {
  id: string;
  message: string;
  category: string;
  createdAt: string;
}

export interface SystemStatusItem {
  id: string;
  service: string;
  status: SystemHealthStatus;
  latencyMs: number;
}
