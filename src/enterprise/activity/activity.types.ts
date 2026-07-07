export type ActivityType =
  | 'create'
  | 'update'
  | 'delete'
  | 'suspend'
  | 'restore'
  | 'role_change'
  | 'avatar_change'
  | 'password_change'
  | 'password_reset'
  | 'invite'
  | 'verification';

export interface ActivityLogRecord {
  id: string;
  requestId: string | null;
  correlationId: string | null;
  traceId: string | null;
  actorId: string | null;
  targetId: string;
  targetType: string;
  activityType: ActivityType | string;
  description: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface ActivityLogQuery {
  targetType: string;
  targetId: string;
  limit?: number;
}

export interface UserActivityLogQuery {
  userId: string;
  limit?: number;
  cursor?: string | null;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}
