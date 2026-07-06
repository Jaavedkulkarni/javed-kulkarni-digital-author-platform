export type PlatformAdminOperationResult<T = void> = {
  success: boolean;
  data?: T;
  errors?: string[];
};

export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';
export type ReviewDecision = 'approve' | 'reject' | 'request_changes';
export type TicketStatus = 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
export type SettlementStatus = 'pending' | 'completed';
