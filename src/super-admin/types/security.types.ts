export type AuditEventType =
  | 'permission_change'
  | 'role_change'
  | 'failed_login'
  | 'session'
  | 'suspicious_activity'
  | 'destructive_action';

export interface SecurityAuditEntry {
  id: string;
  eventType: AuditEventType;
  actorId: string | null;
  description: string;
  ipAddress: string | null;
  createdAt: string;
}

export interface ActiveSession {
  id: string;
  userId: string;
  device: string;
  location: string;
  lastActiveAt: string;
}
