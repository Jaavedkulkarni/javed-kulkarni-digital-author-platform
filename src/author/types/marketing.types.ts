import type { CampaignStatus } from './common';

export interface PromoLink {
  id: string;
  authorId: string;
  bookId: string | null;
  label: string;
  slug: string;
  url: string;
  clicks: number;
  conversions: number;
  createdAt: string;
}

export interface ReferralRecord {
  id: string;
  authorId: string;
  referrerCode: string;
  referredUserId: string | null;
  converted: boolean;
  createdAt: string;
}

export interface UtmCampaign {
  id: string;
  authorId: string;
  campaignName: string;
  source: string;
  medium: string;
  clicks: number;
  conversions: number;
  revenue: number;
  status: CampaignStatus;
  startedAt: string;
}

export interface CouponPerformance {
  couponCode: string;
  uses: number;
  revenue: number;
  discountGiven: number;
  conversionRate: number;
}

export interface MarketingSummary {
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  activeCampaigns: number;
  topPromoLink: string | null;
}
