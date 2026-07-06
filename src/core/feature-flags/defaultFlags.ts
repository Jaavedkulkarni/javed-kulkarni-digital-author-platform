import type { FeatureFlagDefinition } from '../types/featureFlag.types';

export const DEFAULT_FEATURE_FLAGS: readonly FeatureFlagDefinition[] = [
  {
    id: 'cms',
    label: 'CMS',
    description: 'Content management system for books and catalog',
    defaultEnabled: true,
  },
  {
    id: 'payments',
    label: 'Payments',
    description: 'Checkout, orders, and payment processing',
    defaultEnabled: false,
  },
  {
    id: 'membership',
    label: 'Membership',
    description: 'Membership tiers and subscriptions',
    defaultEnabled: true,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Platform analytics and reporting',
    defaultEnabled: true,
  },
  {
    id: 'hav-ai',
    label: 'HAV AI',
    description: 'AI-assisted authoring tools',
    defaultEnabled: false,
  },
  {
    id: 'blog',
    label: 'Blog',
    description: 'Blog publishing module',
    defaultEnabled: true,
  },
  {
    id: 'author-dashboard',
    label: 'Author Dashboard',
    description: 'Author workspace and tools',
    defaultEnabled: true,
  },
  {
    id: 'publisher-dashboard',
    label: 'Publisher Dashboard',
    description: 'Publisher workspace and catalog management',
    defaultEnabled: true,
  },
  {
    id: 'admin-dashboard',
    label: 'Admin Dashboard',
    description: 'Platform administration console',
    defaultEnabled: true,
  },
] as const;
