import type { Campaign, CouponItem, BannerItem, Announcement, EmailCampaignQueueItem } from '../types/marketing.types';
import { generateId } from '../utils/permissions';

const campaigns: Campaign[] = [
  { id: generateId('camp'), name: 'Monsoon Reads 2026', status: 'active', startDate: new Date().toISOString(), endDate: null },
];
const coupons: CouponItem[] = [
  { id: generateId('cp'), code: 'MONSOON20', discount: '20%', status: 'active' },
];
const banners: BannerItem[] = [
  { id: generateId('bn'), title: 'Featured Author Spotlight', placement: 'homepage', status: 'active' },
];
const announcements: Announcement[] = [
  { id: generateId('ann'), title: 'New Paperback Service Launch', status: 'published', publishAt: new Date().toISOString() },
];
const emailQueue: EmailCampaignQueueItem[] = [
  { id: generateId('em'), subject: 'Weekly Newsletter', recipients: 12500, status: 'queued', scheduledAt: new Date().toISOString() },
];

export function getCampaigns() { return campaigns; }
export function getCoupons() { return coupons; }
export function getBanners() { return banners; }
export function getAnnouncements() { return announcements; }
export function getEmailQueue() { return emailQueue; }
