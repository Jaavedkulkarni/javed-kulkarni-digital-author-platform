export interface AnalyticsSnapshot {
  revenue: { daily: number; monthly: number; growth: number };
  growth: { readers: number; authors: number; publishers: number };
  books: { total: number; published: number; pending: number };
  membership: { active: number; churn: number };
  paperback: { jobs: number; completed: number };
  conversion: { rate: number; funnel: string };
  topCountries: { country: string; users: number }[];
  topLanguages: { language: string; share: number }[];
  devices: { device: string; share: number }[];
}
