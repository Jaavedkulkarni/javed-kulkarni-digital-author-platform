import type { CommerceSellerDetails } from '../types/common';

export const COMMERCE_SCOPE = 'commerce';
export const DEFAULT_CURRENCY = 'INR' as const;
export const GUEST_CHECKOUT_ENABLED = false;
export const CHECKOUT_SESSION_TTL_MINUTES = 30;
export const DEFAULT_GST_RATE = 0.18;
export const MEMBERSHIP_DISCOUNT_RATES = {
  free: 0,
  basic: 0.05,
  premium: 0.15,
  lifetime: 0.2,
} as const;

export const DEFAULT_SELLER: CommerceSellerDetails = {
  legalName: 'AuthorOS Digital Publishing Pvt. Ltd.',
  tradeName: 'AuthorOS',
  gstin: '27AABCA1234A1Z5',
  address: {
    line1: 'AuthorOS House',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    postalCode: '411001',
  },
  email: 'billing@authoros.com',
  phone: '+91 20 1234 5678',
};

export const SELLER_STATE_CODE = 'MH';
