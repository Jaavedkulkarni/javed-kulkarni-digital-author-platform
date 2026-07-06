import type { MarketingSummary } from '../types/marketing.types';
import {
  getPromoLinks,
  getReferrals,
  getCampaigns,
  getCouponPerformance,
  createPromoLink,
  seedMarketingData,
} from '../stores/marketingStore';

export class MarketingService {
  getSummary(authorId: string): MarketingSummary {
    seedMarketingData(authorId);
    const links = getPromoLinks(authorId);
    const campaigns = getCampaigns(authorId);

    const totalClicks = links.reduce((s, l) => s + l.clicks, 0) + campaigns.reduce((s, c) => s + c.clicks, 0);
    const totalConversions =
      links.reduce((s, l) => s + l.conversions, 0) + campaigns.reduce((s, c) => s + c.conversions, 0);
    const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);
    const topLink = [...links].sort((a, b) => b.clicks - a.clicks)[0];

    return {
      totalClicks,
      totalConversions,
      totalRevenue,
      activeCampaigns: campaigns.filter((c) => c.status === 'active').length,
      topPromoLink: topLink?.label ?? null,
    };
  }

  getPromoLinks(authorId: string) {
    seedMarketingData(authorId);
    return getPromoLinks(authorId);
  }

  getReferrals(authorId: string) {
    return getReferrals(authorId);
  }

  getCampaigns(authorId: string) {
    seedMarketingData(authorId);
    return getCampaigns(authorId);
  }

  getCouponPerformance(authorId: string) {
    seedMarketingData(authorId);
    return getCouponPerformance(authorId);
  }

  createPromoLink(authorId: string, input: { bookId?: string | null; label: string; slug: string }) {
    return createPromoLink(authorId, input);
  }
}

export function createMarketingService(): MarketingService {
  return new MarketingService();
}
