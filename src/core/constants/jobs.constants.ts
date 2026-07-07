export const JOB_QUEUES = {
  DEFAULT: 'default',
  EMAIL: 'email',
  NOTIFICATION: 'notification',
  IMAGE: 'image',
  ANALYTICS: 'analytics',
  SEARCH: 'search',
} as const;

export type JobQueueName = (typeof JOB_QUEUES)[keyof typeof JOB_QUEUES];

export const JOB_TYPES = [
  'email',
  'notification',
  'image_processing',
  'thumbnail_generation',
  'audit_cleanup',
  'cache_refresh',
  'search_index',
  'analytics',
  'ai_task',
] as const;

export type JobTypeName = (typeof JOB_TYPES)[number];

export const DEFAULT_JOB_MAX_ATTEMPTS = 5;
export const DEFAULT_JOB_PRIORITY = 0;
