import type { AuditLogEntry, CreateAuditLogInput } from '../types/audit.types';
import { appendAuditLog, getAuditLogs } from '../stores/auditStore';

export interface IAuditLogRepository {
  append(input: CreateAuditLogInput): Promise<AuditLogEntry>;
  list(filters?: {
    actorId?: string;
    organizationId?: string;
    eventType?: AuditLogEntry['eventType'];
    limit?: number;
  }): Promise<AuditLogEntry[]>;
}

export class InMemoryAuditLogRepository implements IAuditLogRepository {
  async append(input: CreateAuditLogInput): Promise<AuditLogEntry> {
    return appendAuditLog(input);
  }

  async list(filters?: {
    actorId?: string;
    organizationId?: string;
    eventType?: AuditLogEntry['eventType'];
    limit?: number;
  }): Promise<AuditLogEntry[]> {
    return getAuditLogs(filters);
  }
}

export function createAuditLogRepository(): InMemoryAuditLogRepository {
  return new InMemoryAuditLogRepository();
}
