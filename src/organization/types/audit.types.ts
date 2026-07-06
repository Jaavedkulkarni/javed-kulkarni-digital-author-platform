export type AuditEventType =
  | 'role_assignment'
  | 'workspace_switch'
  | 'permission_change'
  | 'organization_event'
  | 'publisher_approval'
  | 'author_verification'
  | 'login'
  | 'logout'
  | 'invitation_sent'
  | 'invitation_accepted';

export interface AuditLogEntry {
  id: string;
  eventType: AuditEventType;
  actorId: string;
  targetId: string | null;
  organizationId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface CreateAuditLogInput {
  eventType: AuditEventType;
  actorId: string;
  targetId?: string | null;
  organizationId?: string | null;
  metadata?: Record<string, unknown>;
}
