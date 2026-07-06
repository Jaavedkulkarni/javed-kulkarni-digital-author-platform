export type QuoteStatus = 'pending' | 'submitted' | 'won' | 'lost' | 'expired';

export type ProductionJobStatus =
  | 'waiting_files'
  | 'files_received'
  | 'prepress'
  | 'proof_ready'
  | 'printing'
  | 'binding'
  | 'packing'
  | 'ready_for_dispatch'
  | 'dispatched'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'approved' | 'paid';

export type ProofApprovalStatus = 'awaiting_upload' | 'awaiting_approval' | 'approved' | 'rejected';

export type JobPriority = 'low' | 'normal' | 'high' | 'urgent';

export type ReturnStatus = 'none' | 'in_transit' | 'returned' | 'resolved';

export interface PublisherOperationResult<T = void> {
  success: boolean;
  data?: T;
  errors?: string[];
}
