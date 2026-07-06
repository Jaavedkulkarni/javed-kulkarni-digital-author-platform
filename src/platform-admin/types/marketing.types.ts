export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate: string | null;
}

export interface CouponItem {
  id: string;
  code: string;
  discount: string;
  status: 'active' | 'expired' | 'disabled';
}

export interface BannerItem {
  id: string;
  title: string;
  placement: string;
  status: 'active' | 'scheduled' | 'inactive';
}

export interface Announcement {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  publishAt: string | null;
}

export interface EmailCampaignQueueItem {
  id: string;
  subject: string;
  recipients: number;
  status: 'queued' | 'sending' | 'sent';
  scheduledAt: string;
}
