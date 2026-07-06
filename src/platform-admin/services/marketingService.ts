import {
  getCampaigns,
  getCoupons,
  getBanners,
  getAnnouncements,
  getEmailQueue,
} from '../stores/marketingStore';

export class MarketingService {
  getCampaigns() { return getCampaigns(); }
  getCoupons() { return getCoupons(); }
  getBanners() { return getBanners(); }
  getAnnouncements() { return getAnnouncements(); }
  getEmailQueue() { return getEmailQueue(); }
}

export function createMarketingService(): MarketingService {
  return new MarketingService();
}
