import type { ExecutiveDashboardOverview, ExecutiveActivity, SystemStatusItem } from '../types/executive.types';
import { generateId } from '../utils/common';

export function getExecutiveOverview(): ExecutiveDashboardOverview {
  return {
    platformHealth: 'healthy',
    todaysRevenue: 48500,
    monthlyRevenue: 1250000,
    booksSold: 342,
    orders: 289,
    memberships: 1240,
    readers: 8500,
    authors: 320,
    publishers: 18,
    platformAdmins: 12,
    pendingReviews: 8,
    pendingPublisherApprovals: 3,
    pendingWithdrawals: 5,
    supportQueue: 14,
    paperbackProduction: 7,
    storageUsageGb: 42.5,
    storageLimitGb: 100,
  };
}

export function getRecentActivities(): ExecutiveActivity[] {
  return [
    { id: generateId('act'), message: 'New publisher registration submitted', category: 'publishers', createdAt: new Date().toISOString() },
    { id: generateId('act'), message: 'Author withdrawal request pending', category: 'finance', createdAt: new Date().toISOString() },
    { id: generateId('act'), message: 'Book review completed', category: 'content', createdAt: new Date().toISOString() },
  ];
}

export function getSystemStatus(): SystemStatusItem[] {
  return [
    { id: 'api', service: 'API Gateway', status: 'healthy', latencyMs: 45 },
    { id: 'db', service: 'Database', status: 'healthy', latencyMs: 12 },
    { id: 'storage', service: 'Storage', status: 'healthy', latencyMs: 88 },
    { id: 'commerce', service: 'Commerce Engine', status: 'healthy', latencyMs: 62 },
  ];
}
