export type JobType =
  | 'email'
  | 'notification'
  | 'image_processing'
  | 'thumbnail_generation'
  | 'audit_cleanup'
  | 'cache_refresh'
  | 'search_index'
  | 'analytics'
  | 'ai_task';

export type JobStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'dead_letter'
  | 'scheduled'
  | 'cancelled';

export interface BackgroundJobRecord {
  id: string;
  jobType: JobType;
  queue: string;
  payload: Record<string, unknown>;
  status: JobStatus;
  priority: number;
  attempts: number;
  maxAttempts: number;
  scheduledFor: string | null;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
}

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  email: 'Email',
  notification: 'Notification',
  image_processing: 'Image Processing',
  thumbnail_generation: 'Thumbnail Generation',
  audit_cleanup: 'Audit Cleanup',
  cache_refresh: 'Cache Refresh',
  search_index: 'Search Index',
  analytics: 'Analytics',
  ai_task: 'AI Task',
};
