export const NOTIFICATION_CHANNELS = [
  'email',
  'in_app',
  'push',
  'sms',
  'webhook',
] as const;

export type NotificationChannelName = (typeof NOTIFICATION_CHANNELS)[number];

export const NOTIFICATION_CATEGORIES = [
  'account',
  'security',
  'order',
  'membership',
  'content',
  'system',
] as const;

export type NotificationCategoryName = (typeof NOTIFICATION_CATEGORIES)[number];

export const EMAIL_TEMPLATE_IDS = [
  'invite',
  'welcome',
  'password_reset',
  'verification',
  'role_changed',
] as const;

export type EmailTemplateId = (typeof EMAIL_TEMPLATE_IDS)[number];
