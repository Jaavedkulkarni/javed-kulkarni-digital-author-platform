import type { PromoLink, ReferralRecord, UtmCampaign, CouponPerformance } from '../types/marketing.types';

const promoLinks = new Map<string, PromoLink[]>();
const referrals = new Map<string, ReferralRecord[]>();
const campaigns = new Map<string, UtmCampaign[]>();
const coupons = new Map<string, CouponPerformance[]>();

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getPromoLinks(authorId: string): PromoLink[] {
  return promoLinks.get(authorId) ?? [];
}

export function createPromoLink(authorId: string, input: {
  bookId?: string | null;
  label: string;
  slug: string;
}): PromoLink {
  const link: PromoLink = {
    id: createId('promo'),
    authorId,
    bookId: input.bookId ?? null,
    label: input.label,
    slug: input.slug,
    url: `https://authoros.com/r/${input.slug}`,
    clicks: 0,
    conversions: 0,
    createdAt: new Date().toISOString(),
  };
  promoLinks.set(authorId, [...getPromoLinks(authorId), link]);
  return link;
}

export function getReferrals(authorId: string): ReferralRecord[] {
  return referrals.get(authorId) ?? [];
}

export function getCampaigns(authorId: string): UtmCampaign[] {
  return campaigns.get(authorId) ?? [];
}

export function getCouponPerformance(authorId: string): CouponPerformance[] {
  return coupons.get(authorId) ?? [];
}

export function seedMarketingData(authorId: string): void {
  if (getPromoLinks(authorId).length > 0) return;
  createPromoLink(authorId, { label: 'Launch Campaign', slug: `${authorId.slice(0, 8)}-launch` });
  coupons.set(authorId, [
    { couponCode: 'WELCOME10', uses: 12, revenue: 3588, discountGiven: 398, conversionRate: 8 },
    { couponCode: 'AUTHOR20', uses: 5, revenue: 1495, discountGiven: 299, conversionRate: 12 },
  ]);
  campaigns.set(authorId, [
    {
      id: createId('utm'),
      authorId,
      campaignName: 'Monsoon Launch',
      source: 'instagram',
      medium: 'social',
      clicks: 240,
      conversions: 18,
      revenue: 5382,
      status: 'active',
      startedAt: new Date().toISOString(),
    },
  ]);
}

export function resetMarketingStore(): void {
  promoLinks.clear();
  referrals.clear();
  campaigns.clear();
  coupons.clear();
}
