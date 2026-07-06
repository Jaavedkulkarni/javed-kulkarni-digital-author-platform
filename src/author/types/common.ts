export type AuthorBookStatus = 'draft' | 'review' | 'published' | 'archived';

export interface AuthorOperationResult<T = void> {
  success: boolean;
  data?: T;
  errors?: string[];
}

export type RoyaltyStatus = 'pending' | 'paid';

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export type WithdrawalStatus = 'requested' | 'approved' | 'processing' | 'completed' | 'rejected';

export type KycVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export type ContractStatus = 'draft' | 'active' | 'expired' | 'terminated';

export type CampaignStatus = 'active' | 'paused' | 'ended';

export type ExportFormat = 'csv' | 'xlsx' | 'pdf';

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high';

export type CalendarEventType = 'publish' | 'review' | 'promotion' | 'deadline' | 'other';
