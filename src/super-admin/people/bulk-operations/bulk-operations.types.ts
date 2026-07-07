export type BulkOperationType =
  | 'suspend'
  | 'restore'
  | 'delete'
  | 'recover'
  | 'assign_role'
  | 'remove_role'
  | 'force_password_reset'
  | 'send_verification'
  | 'send_invite'
  | 'bulk_edit';

export type BulkResultStatus = 'success' | 'failed' | 'skipped';

export interface BulkUserResult {
  userId: string;
  email?: string | null;
  name?: string | null;
  status: BulkResultStatus;
  reason?: string;
}

export interface BulkOperationProgress {
  completed: number;
  failed: number;
  skipped: number;
  total: number;
  currentUserId?: string | null;
  currentUserName?: string | null;
  results: BulkUserResult[];
  cancelled?: boolean;
}

export interface BulkOperationPayload {
  reason?: string;
  notes?: string;
  effectiveImmediately?: boolean;
  role?: string;
  confirmed?: boolean;
  fields?: Record<string, unknown>;
}

export interface BulkUsersApiResponse {
  async?: boolean;
  jobId?: string;
  parentAuditId?: string;
  progress?: BulkOperationProgress;
}

export const BULK_OPERATION_LABELS: Record<BulkOperationType, string> = {
  suspend: 'Bulk Suspend',
  restore: 'Bulk Restore',
  delete: 'Bulk Delete',
  recover: 'Bulk Recover',
  assign_role: 'Bulk Role Assignment',
  remove_role: 'Bulk Role Removal',
  force_password_reset: 'Bulk Force Password Reset',
  send_verification: 'Bulk Send Verification',
  send_invite: 'Bulk Send Invite',
  bulk_edit: 'Bulk Edit',
};

export const BULK_OPERATIONS_REQUIRING_CONFIRM: BulkOperationType[] = ['delete'];

export const BULK_OPERATIONS_REQUIRING_ROLE: BulkOperationType[] = [
  'assign_role',
  'remove_role',
  'send_invite',
];
