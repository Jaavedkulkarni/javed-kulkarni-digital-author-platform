import type { AnalyticsSnapshot } from '../types/analytics.types';

export function getAnalyticsSnapshot(): AnalyticsSnapshot {
  return {
    revenue: { daily: 48500, monthly: 1250000, growth: 12.5 },
    growth: { readers: 8.2, authors: 15.3, publishers: 22.0 },
    books: { total: 1250, published: 980, pending: 45 },
    membership: { active: 1240, churn: 2.1 },
    paperback: { jobs: 28, completed: 156 },
    conversion: { rate: 3.8, funnel: 'Visit → Signup → Purchase' },
    topCountries: [{ country: 'India', users: 7200 }, { country: 'USA', users: 850 }, { country: 'UK', users: 320 }],
    topLanguages: [{ language: 'English', share: 72 }, { language: 'Marathi', share: 18 }, { language: 'Hindi', share: 10 }],
    devices: [{ device: 'Mobile', share: 58 }, { device: 'Desktop', share: 35 }, { device: 'Tablet', share: 7 }],
  };
}
