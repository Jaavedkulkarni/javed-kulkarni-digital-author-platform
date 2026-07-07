export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'suspend'
  | 'restore'
  | 'assign'
  | 'remove';

export interface AuditLogRecord {
  id: string;
  requestId: string;
  correlationId: string;
  traceId: string;
  spanId: string | null;
  actorId: string | null;
  actorRole: string | null;
  targetId: string | null;
  targetType: string | null;
  action: AuditAction | string;
  entity: string;
  beforeState: Record<string, unknown> | null;
  afterState: Record<string, unknown> | null;
  ipAddress: string | null;
  browser: string | null;
  platform: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface AuditLogQuery {
  targetType?: string;
  targetId?: string;
  actorId?: string;
  limit?: number;
}
