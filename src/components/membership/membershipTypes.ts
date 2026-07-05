export type MembershipPlanId =
  | 'free'
  | 'monthly'
  | 'quarterly'
  | 'half-yearly'
  | 'yearly'
  | 'lifetime';

export type MembershipStatus = 'active' | 'expired' | 'none';

export type BenefitValue = boolean | string;

export interface MembershipPlanDefinition {
  id: MembershipPlanId;
  name: string;
  price: string;
  validity: string;
  features: string[];
  isPopular?: boolean;
  isComingSoon?: boolean;
  isCurrent?: boolean;
}

export interface BenefitComparisonRow {
  label: string;
  values: Record<MembershipPlanId, BenefitValue>;
}

export interface MembershipFaqItem {
  id: string;
  question: string;
  answer: string;
}

export const MEMBERSHIP_STATUS_LABELS: Record<MembershipStatus, string> = {
  active: 'Active',
  expired: 'Expired',
  none: 'No Membership',
};

export const MEMBERSHIP_STATUS_STYLES: Record<MembershipStatus, string> = {
  active:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
  expired:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
  none: 'border-gray-200 bg-gray-100 text-gray-600 dark:border-navy-600 dark:bg-navy-700 dark:text-gray-400',
};

export const POPULAR_BADGE_STYLE =
  'border-gold-300 bg-gold-50 text-gold-800 dark:border-gold-700 dark:bg-gold-950/40 dark:text-gold-300';

export const CURRENT_PLAN_BADGE_STYLE =
  'border-brand/30 bg-brand/10 text-brand dark:border-brand/40 dark:bg-brand/20 dark:text-gold-300';

export const COMING_SOON_BADGE_STYLE =
  'border-gray-200 bg-gray-100 text-gray-500 dark:border-navy-600 dark:bg-navy-700 dark:text-gray-400';

export const LIFETIME_BADGE_LABEL = 'Coming 2027';

export const MEMBERSHIP_PLAN_SAVINGS: Partial<Record<MembershipPlanId, string>> = {
  monthly: 'Save ₹50',
  quarterly: 'Save ₹98',
  'half-yearly': 'Save ₹295',
  yearly: 'Save ₹889',
};

export const PLAN_DURATION_DAYS: Record<MembershipPlanId, number> = {
  free: 0,
  monthly: 30,
  quarterly: 90,
  'half-yearly': 180,
  yearly: 365,
  lifetime: 365,
};

export const MEMBERSHIP_PLANS: MembershipPlanDefinition[] = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    validity: 'Forever',
    features: ['Limited free books', 'Basic articles', 'Community access'],
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: '₹199',
    validity: '30 days',
    features: ['Premium books', 'Premium articles', 'Offline reading', '5% discount'],
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    price: '₹499',
    validity: '90 days',
    features: ['All premium content', 'Offline reading', '10% discount', 'Priority support'],
  },
  {
    id: 'half-yearly',
    name: 'Half-Yearly',
    price: '₹899',
    validity: '180 days',
    features: ['All premium content', 'Offline reading', '15% discount', 'Early access'],
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '₹1,499',
    validity: '365 days',
    features: ['All premium content', 'Offline reading', '20% discount', 'Priority support', 'Early access'],
    isPopular: true,
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '—',
    validity: 'Lifetime',
    features: ['All premium content forever', 'Offline reading', '25% discount', 'Priority support', 'Early access'],
    isComingSoon: true,
  },
];

export const BENEFIT_COMPARISON_ROWS: BenefitComparisonRow[] = [
  {
    label: 'Premium Books',
    values: {
      free: false,
      monthly: true,
      quarterly: true,
      'half-yearly': true,
      yearly: true,
      lifetime: true,
    },
  },
  {
    label: 'Premium Articles',
    values: {
      free: false,
      monthly: true,
      quarterly: true,
      'half-yearly': true,
      yearly: true,
      lifetime: true,
    },
  },
  {
    label: 'Premium Stories',
    values: {
      free: false,
      monthly: true,
      quarterly: true,
      'half-yearly': true,
      yearly: true,
      lifetime: true,
    },
  },
  {
    label: 'Premium Poems',
    values: {
      free: false,
      monthly: true,
      quarterly: true,
      'half-yearly': true,
      yearly: true,
      lifetime: true,
    },
  },
  {
    label: 'Offline Reading',
    values: {
      free: false,
      monthly: true,
      quarterly: true,
      'half-yearly': true,
      yearly: true,
      lifetime: true,
    },
  },
  {
    label: 'Discount',
    values: {
      free: '—',
      monthly: '5%',
      quarterly: '10%',
      'half-yearly': '15%',
      yearly: '20%',
      lifetime: '25%',
    },
  },
  {
    label: 'Priority Support',
    values: {
      free: false,
      monthly: false,
      quarterly: true,
      'half-yearly': true,
      yearly: true,
      lifetime: true,
    },
  },
  {
    label: 'Early Access',
    values: {
      free: false,
      monthly: false,
      quarterly: false,
      'half-yearly': true,
      yearly: true,
      lifetime: true,
    },
  },
];

export const MEMBERSHIP_FAQ_ITEMS: MembershipFaqItem[] = [
  {
    id: 'what-is-membership',
    question: 'What is AuthorOS membership?',
    answer: 'Membership unlocks premium books, articles, stories, poems, and exclusive reader benefits.',
  },
  {
    id: 'how-to-renew',
    question: 'How do I renew my membership?',
    answer: 'You can renew from this page once your current plan is active or nearing expiry.',
  },
  {
    id: 'cancel-anytime',
    question: 'Can I cancel anytime?',
    answer: 'Plan cancellation and refund policies will be available when checkout launches.',
  },
  {
    id: 'offline-reading',
    question: 'Does membership include offline reading?',
    answer: 'Paid plans include offline reading for supported titles in the Downloads section.',
  },
];
